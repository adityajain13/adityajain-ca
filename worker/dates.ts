// API and sign-in for the private date tracker at adityajain.ca/dates.
//
// Sign-in:
//   1. Cloudflare Access (email one-time codes) protects only /dates/auth/login.
//   2. /dates/auth/login verifies the Access JWT, checks the email is on a list, and sets
//      this Worker's own signed session cookie: for a year if the person ticked
//      "stay signed in", otherwise until the browser closes (and at most a day).
//   3. /dates/log, /dates/edit and /dates/api check that cookie on every request. Roles are looked up
//      from the email lists each time, so removing an email revokes access at once.
//      Changing DATES_SESSION_SECRET signs everyone out.
//
// Roles:
//   DATES_EDITORS  can view and edit
//   DATES_VIEWERS  can only view
//
// All settings are Worker secrets set in the Cloudflare dashboard, so no emails
// or keys live in this public repo:
//   ACCESS_TEAM            your Zero Trust team name (the part before .cloudflareaccess.com)
//   ACCESS_AUD             the Access application's "Application Audience (AUD) Tag"
//   DATES_EDITORS          comma-separated emails
//   DATES_VIEWERS          comma-separated emails
//   DATES_SESSION_SECRET   a long random string used to sign session cookies
//
// Data is one JSON document in Workers KV under the key "dates".

import { cleanLists, EMPTY_DOC, validateLists, type DatesDoc, type Me, type Role } from '../src/dates/types'

export interface DatesEnv {
  DATES_KV: {
    get(key: string, type: 'json'): Promise<unknown>
    put(key: string, value: string): Promise<void>
  }
  ACCESS_TEAM?: string
  ACCESS_AUD?: string
  DATES_EDITORS?: string
  DATES_VIEWERS?: string
  DATES_SESSION_SECRET?: string
  // Local development only (.dev.vars); ignored unless the request is to localhost.
  DEV_AUTH_EMAIL?: string
}

const KEY = 'dates'
const ORIGIN = 'https://adityajain.ca'
const MAX_BODY_BYTES = 512 * 1024

const COOKIE = '__Host-datelog'
// Set by the sign-in page just before it hands off to Access, so the "stay signed in"
// choice survives the trip through the Access login even if the query string doesn't.
const REMEMBER_COOKIE = 'datelog_remember'
const YEAR = 365 * 24 * 60 * 60
const DAY = 24 * 60 * 60
const AFTER_LOGIN = new Set(['/dates/log', '/dates/edit'])

export async function handleDatesApi(request: Request, env: DatesEnv, url: URL): Promise<Response> {
  const session = await signedInSession(request, env, url)
  if (!session) return json({ error: 'Not signed in' }, 401)
  const { email } = session
  const role = roleFor(email, env)
  if (!role) return json({ error: 'This email is not allowed' }, 403)
  const me: Me = { email, role }

  if (url.pathname === '/dates/api/me' && request.method === 'GET') {
    const res = json(me)
    // Remembered sessions slide: each visit (at most once a day) restarts the year,
    // so a device that's used regularly never gets signed out.
    const now = Math.floor(Date.now() / 1000)
    const secret = sessionSecret(env)
    const remembered = session.r ?? session.exp - session.iat > DAY // older cookies have no r flag
    if (remembered && secret && now - session.iat > DAY) {
      res.headers.append('set-cookie', await sessionCookie(email, true, secret))
    }
    return res
  }

  if (url.pathname === '/dates/api/dates') {
    if (request.method === 'GET') return json(await load(env))

    if (request.method === 'PUT') {
      if (me.role !== 'editor') return json({ error: 'You have view-only access' }, 403)

      // Only accept writes made by the editor page itself.
      const origin = request.headers.get('origin')
      if (origin && origin !== ORIGIN && !isLocal(url)) return json({ error: 'Bad origin' }, 403)
      if (!request.headers.get('content-type')?.includes('application/json')) {
        return json({ error: 'Expected JSON' }, 415)
      }
      const length = Number(request.headers.get('content-length') ?? 0)
      if (length > MAX_BODY_BYTES) return json({ error: 'Too large' }, 413)

      let body: { baseVersion?: unknown; past?: unknown; future?: unknown }
      try {
        const text = await request.text()
        if (text.length > MAX_BODY_BYTES) return json({ error: 'Too large' }, 413)
        body = JSON.parse(text)
      } catch {
        return json({ error: 'Invalid JSON' }, 400)
      }

      const problem = validateLists(body.past, body.future)
      if (problem) return json({ error: problem }, 400)

      const current = await load(env)
      // Optimistic locking: if someone else saved since this editor loaded, refuse.
      if (body.baseVersion !== current.version) {
        return json({ error: 'Someone saved changes since you loaded the page', current }, 409)
      }

      const { past, future } = cleanLists(body.past as DatesDoc['past'], body.future as DatesDoc['future'])
      const next: DatesDoc = {
        version: current.version + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: me.email,
        past,
        future,
      }
      await env.DATES_KV.put(KEY, JSON.stringify(next))
      return json(next)
    }
  }

  return json({ error: 'Not found' }, 404)
}

async function load(env: DatesEnv): Promise<DatesDoc> {
  const stored = (await env.DATES_KV.get(KEY, 'json')) as DatesDoc | null
  return stored ?? EMPTY_DOC
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}

const isLocal = (url: URL) => url.hostname === 'localhost' || url.hostname === '127.0.0.1'

const emails = (list?: string) =>
  new Set(
    (list ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  )

function roleFor(email: string, env: DatesEnv): Role | null {
  const e = email.toLowerCase()
  if (emails(env.DATES_EDITORS).has(e)) return 'editor'
  if (emails(env.DATES_VIEWERS).has(e)) return 'viewer'
  return null
}

/** /dates/auth/login and /dates/auth/logout. Access sits in front of /dates/auth/login only. */
export async function handleDatesAuth(request: Request, env: DatesEnv, url: URL): Promise<Response> {
  const next = AFTER_LOGIN.has(url.searchParams.get('next') ?? '') ? url.searchParams.get('next')! : '/dates/log'

  if (url.pathname === '/dates/auth/logout') {
    // Clear our cookie, then end the Access session too.
    return redirect(isLocal(url) ? '/dates/log' : '/cdn-cgi/access/logout', clearCookie())
  }

  if (url.pathname !== '/dates/auth/login') return new Response('Not found', { status: 404 })

  let email: string | null = null
  if (env.DEV_AUTH_EMAIL && isLocal(url)) {
    email = env.DEV_AUTH_EMAIL
  } else if (env.ACCESS_TEAM && env.ACCESS_AUD) {
    const token = request.headers.get('cf-access-jwt-assertion')
    if (token) email = await verifyAccessJwt(token, env.ACCESS_TEAM, env.ACCESS_AUD)
  }
  if (!email) return new Response('Sign-in is not set up correctly.', { status: 403 })

  if (!roleFor(email, env)) return redirect('/dates/log?denied=1', clearCookie())

  const secret = sessionSecret(env)
  if (!secret) return new Response('Sign-in is not set up correctly.', { status: 503 })

  const rememberCookie = readCookie(request, REMEMBER_COOKIE)
  const remember = url.searchParams.get('remember') === '1' || rememberCookie === '1'
  return redirect(next, await sessionCookie(email, remember, secret), clearRememberCookie())
}

/** A remembered session persists for a year; otherwise the cookie goes away when the browser closes. */
async function sessionCookie(email: string, remember: boolean, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const token = await signSession({ email, iat: now, exp: now + (remember ? YEAR : DAY), r: remember }, secret)
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax${remember ? `; Max-Age=${YEAR}` : ''}`
}

function redirect(location: string, ...cookies: string[]): Response {
  const headers = new Headers({ location, 'cache-control': 'no-store' })
  for (const c of cookies) headers.append('set-cookie', c)
  return new Response(null, { status: 302, headers })
}

const clearRememberCookie = () => `${REMEMBER_COOKIE}=; Path=/dates/auth; Secure; SameSite=Lax; Max-Age=0`

function readCookie(request: Request, name: string): string | undefined {
  return (request.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`

function sessionSecret(env: DatesEnv): string | null {
  const s = env.DATES_SESSION_SECRET
  return s && s.length >= 32 ? s : null // fail closed if missing or too short
}

async function signedInSession(request: Request, env: DatesEnv, url: URL): Promise<Session | null> {
  // Local testing with `wrangler dev` only.
  if (env.DEV_AUTH_EMAIL && isLocal(url) && !sessionSecret(env)) return { email: env.DEV_AUTH_EMAIL, iat: 0, exp: 0 }

  const secret = sessionSecret(env)
  if (!secret) return null
  const raw = readCookie(request, COOKIE)
  if (!raw) return null
  return verifySession(raw, secret)
}

// ---- Session cookies: base64url(JSON payload) + "." + base64url(HMAC-SHA256) ----

type Session = { email: string; iat: number; exp: number; r?: boolean } // r: remembered on this device

const enc = new TextEncoder()
const bytesToB64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const hmacKey = (secret: string) =>
  crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])

async function signSession(session: Session, secret: string): Promise<string> {
  const payload = bytesToB64url(enc.encode(JSON.stringify(session)))
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload)))
  return `${payload}.${bytesToB64url(sig)}`
}

async function verifySession(token: string, secret: string): Promise<Session | null> {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), b64urlToBytes(sig), enc.encode(payload))
    if (!ok) return null
    const session = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload))) as Session
    if (typeof session.email !== 'string' || typeof session.exp !== 'number') return null
    if (session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

// ---- Cloudflare Access JWT verification (RS256) ----

type Jwk = JsonWebKey & { kid: string }
let certCache: { team: string; keys: Jwk[]; fetchedAt: number } | null = null

async function accessKeys(team: string, forceRefresh = false): Promise<Jwk[]> {
  const fresh = certCache && certCache.team === team && Date.now() - certCache.fetchedAt < 60 * 60 * 1000
  if (fresh && !forceRefresh) return certCache!.keys
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`)
  if (!res.ok) throw new Error('Could not load Access certificates')
  const { keys } = (await res.json()) as { keys: Jwk[] }
  certCache = { team, keys, fetchedAt: Date.now() }
  return keys
}

const b64urlToBytes = (s: string) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

async function verifyAccessJwt(token: string, team: string, aud: string): Promise<string | null> {
  try {
    const [h, p, sig] = token.split('.')
    if (!h || !p || !sig) return null
    const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h))) as { alg?: string; kid?: string }
    if (header.alg !== 'RS256' || !header.kid) return null

    let jwk = (await accessKeys(team)).find((k) => k.kid === header.kid)
    if (!jwk) jwk = (await accessKeys(team, true)).find((k) => k.kid === header.kid) // keys rotate
    if (!jwk) return null

    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, [
      'verify',
    ])
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64urlToBytes(sig),
      new TextEncoder().encode(`${h}.${p}`),
    )
    if (!valid) return null

    const claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(p))) as {
      aud?: string | string[]
      exp?: number
      nbf?: number
      iss?: string
      email?: string
    }
    const now = Math.floor(Date.now() / 1000)
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
    if (!auds.includes(aud)) return null
    if (claims.iss !== `https://${team}.cloudflareaccess.com`) return null
    if (!claims.exp || claims.exp < now) return null
    if (claims.nbf && claims.nbf > now + 60) return null
    return typeof claims.email === 'string' ? claims.email : null
  } catch {
    return null
  }
}

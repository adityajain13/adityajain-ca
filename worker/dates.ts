// API for the private date tracker at dates.adityajain.ca.
//
// Sign-in is handled by Cloudflare Access (email one-time codes). Access sits in
// front of /log, /edit and /api and adds a signed JWT to each request; this file
// verifies that JWT and then decides the role from two lists of emails:
//
//   DATES_EDITORS  can view and edit
//   DATES_VIEWERS  can only view
//
// All settings are Worker secrets set in the Cloudflare dashboard, so no emails
// or IDs live in this public repo:
//   ACCESS_TEAM     your Zero Trust team name (the part before .cloudflareaccess.com)
//   ACCESS_AUD      the Access application's "Application Audience (AUD) Tag"
//   DATES_EDITORS   comma-separated emails
//   DATES_VIEWERS   comma-separated emails
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
  // Local development only (.dev.vars); ignored unless the request is to localhost.
  DEV_AUTH_EMAIL?: string
}

const KEY = 'dates'
const ORIGIN = 'https://dates.adityajain.ca'
const MAX_BODY_BYTES = 512 * 1024

export async function handleDatesApi(request: Request, env: DatesEnv, url: URL): Promise<Response> {
  const me = await authenticate(request, env, url)
  if (!me) return json({ error: 'Not signed in or not allowed' }, 403)

  if (url.pathname === '/api/me' && request.method === 'GET') return json(me)

  if (url.pathname === '/api/dates') {
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

async function authenticate(request: Request, env: DatesEnv, url: URL): Promise<Me | null> {
  // Local testing with `wrangler dev` only: pretend to be DEV_AUTH_EMAIL.
  if (env.DEV_AUTH_EMAIL && isLocal(url)) {
    const role = roleFor(env.DEV_AUTH_EMAIL, env)
    return role ? { email: env.DEV_AUTH_EMAIL, role } : null
  }

  // Fail closed if Access isn't configured.
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD) return null

  const token = request.headers.get('cf-access-jwt-assertion')
  if (!token) return null

  const email = await verifyAccessJwt(token, env.ACCESS_TEAM, env.ACCESS_AUD)
  if (!email) return null

  const role = roleFor(email, env)
  return role ? { email, role } : null
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

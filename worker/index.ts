// Routes requests for adityajain.ca. Pages are static assets built by Vite into dist/.
//
//   adityajain.ca/              → main site
//   adityajain.ca/atlas         → Atlas page
//   adityajain.ca/vibething     → VibeThing page
//   adityajain.ca/genre         → Spotify Genre Searcher page
//   adityajain.ca/paladins      → Paladins (Crusader Kings III mod) page
//   adityajain.ca/cal           → calendar page; /cal/calendar.ics is the feed, served live
//                                 from the adityajain13/holidays repo
//   adityajain.ca/dates         → Date Tracker page. /dates/log and /dates/edit open the
//                                 private app, /dates/api/* is its API and /dates/auth/* its
//                                 sign-in (worker/dates.ts). Cloudflare Access protects
//                                 /dates/auth/login.
//
// Old subdomain links (vibething.adityajain.ca/…, www.…) redirect to the paths above.
// cal.adityajain.ca/calendar.ics is still served directly, since calendar apps that
// subscribed to it may not follow redirects.

import { handleDatesApi, handleDatesAuth, type DatesEnv } from './dates'

interface Env extends DatesEnv {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

const APEX = 'adityajain.ca'

// Project pages: path segment → folder in dist/ (each folder has an index.html).
const PAGES = ['atlas', 'vibething', 'genre', 'paladins', 'cal', 'dates', 'travel'] as const
type Page = (typeof PAGES)[number]
const isPage = (s: string): s is Page => (PAGES as readonly string[]).includes(s)

const DATES_APP = '/dates-app/'
const CALENDAR_SOURCE = 'https://raw.githubusercontent.com/adityajain13/holidays/main/holidays.ics'
const CALENDAR_FILES = new Set(['calendar.ics', 'holidays.ics'])

const isLocalHost = (h: string) => h === 'localhost' || h === '127.0.0.1'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const host = url.hostname

    // Backup for Cloudflare's "Always Use HTTPS": never serve anything over plain HTTP.
    if (url.protocol === 'http:' && !isLocalHost(host)) {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    // The main domain (and localhost for `wrangler dev`) serves everything.
    if (host === APEX || isLocalHost(host)) return serveSite(request, env, url)

    // Old subdomain links → the same thing on the main domain.
    if (host.endsWith(`.${APEX}`)) {
      const sub = host.slice(0, -(APEX.length + 1))
      if (sub === 'cal' && CALENDAR_FILES.has(url.pathname.slice(1))) return serveCalendar()
      const target = new URL(`https://${APEX}`)
      target.pathname = isPage(sub) ? `/${sub}${url.pathname === '/' ? '' : url.pathname}` : sub === 'www' ? url.pathname : '/'
      target.search = isPage(sub) || sub === 'www' ? url.search : ''
      return Response.redirect(target.toString(), 301)
    }

    // Anything else (e.g. the workers.dev preview URL) gets the static site as-is.
    return env.ASSETS.fetch(request)
  },
}

async function serveSite(request: Request, env: Env, url: URL): Promise<Response> {
  const [, first = '', ...rest] = url.pathname.split('/')

  // The built private-app folder isn't a page of its own.
  if (first === DATES_APP.slice(1, -1)) return Response.redirect(new URL('/dates/log', url).toString(), 301)

  if (!isPage(first)) return env.ASSETS.fetch(request)

  const sub = rest.join('/')

  if (first === 'cal' && CALENDAR_FILES.has(sub)) return serveCalendar()

  if (first === 'dates') {
    if (sub.startsWith('api/')) return handleDatesApi(request, env, url)
    if (sub.startsWith('auth/')) return handleDatesAuth(request, env, url)
    if (/^(log|edit)\/?$/.test(sub)) {
      return noStore(await env.ASSETS.fetch(new Request(new URL(DATES_APP, url), request)))
    }
  }

  // Clean URLs: /vibething/ and /vibething/anything → /vibething
  if (url.pathname !== `/${first}`) return Response.redirect(new URL(`/${first}${url.search}`, url).toString(), 301)

  return env.ASSETS.fetch(new Request(new URL(`/${first}/`, url), request))
}

function noStore(res: Response): Response {
  const out = new Response(res.body, res)
  out.headers.set('cache-control', 'no-store')
  return out
}

async function serveCalendar(): Promise<Response> {
  const upstream = await fetch(CALENDAR_SOURCE, {
    cf: { cacheTtl: 3600, cacheEverything: true },
  } as RequestInit)

  if (!upstream.ok) {
    return new Response('Calendar is temporarily unavailable.', { status: 502 })
  }

  return new Response(upstream.body, {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': 'inline; filename="calendar.ics"',
      'cache-control': 'public, max-age=3600',
      'access-control-allow-origin': '*',
    },
  })
}

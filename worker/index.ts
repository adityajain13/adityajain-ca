// Routes each hostname to the right part of the site. Everything except the
// calendar file is a static asset built by Vite into dist/.
//
//   adityajain.ca            → main site
//   www.adityajain.ca        → 301 to adityajain.ca
//   atlas.adityajain.ca      → /atlas/ page
//   vibething.adityajain.ca  → /vibething/ page
//   genre.adityajain.ca      → /genre/ page (Spotify Genre Searcher)
//   cal.adityajain.ca        → /cal/ page, plus /calendar.ics served live from
//                              the adityajain13/holidays repo

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

const APEX = 'adityajain.ca'

// subdomain → folder in dist/
const PAGES: Record<string, string> = {
  atlas: '/atlas/',
  vibething: '/vibething/',
  cal: '/cal/',
  genre: '/genre/',
}

const CALENDAR_SOURCE = 'https://raw.githubusercontent.com/adityajain13/holidays/main/holidays.ics'
const CALENDAR_PATHS = new Set(['/calendar.ics', '/holidays.ics'])

// Files (JS, CSS, images, fonts, favicon) are shared by every page and served as-is.
const isFile = (pathname: string) => pathname.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(pathname)

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const host = url.hostname

    if (host === `www.${APEX}`) {
      url.hostname = APEX
      return Response.redirect(url.toString(), 301)
    }

    // On the main domain, send /atlas/, /vibething/ and /cal/ to their subdomains.
    if (host === APEX) {
      const sub = Object.keys(PAGES).find((s) => url.pathname === `/${s}` || url.pathname.startsWith(`/${s}/`))
      if (sub) return Response.redirect(`https://${sub}.${APEX}/`, 301)
      return env.ASSETS.fetch(request)
    }

    const sub = host.endsWith(`.${APEX}`) ? host.slice(0, -(APEX.length + 1)) : null
    const page = sub ? PAGES[sub] : undefined

    // Unknown hosts (e.g. the workers.dev preview URL) just get the static site.
    if (!sub || !page) return env.ASSETS.fetch(request)

    if (sub === 'cal' && CALENDAR_PATHS.has(url.pathname)) return serveCalendar()

    if (isFile(url.pathname)) return env.ASSETS.fetch(request)

    // Every other path on a project subdomain shows that project's page.
    return env.ASSETS.fetch(new Request(new URL(page, url), request))
  },
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

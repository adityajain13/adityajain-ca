# adityajain.ca

Personal site. Vite + React + TypeScript + Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Where things live

- **Content:** `src/data/site.ts` holds every project, link and the resume. Search for `TODO` to find the links still to fill in.
- **Colors and fonts:** the `@theme` block in `src/index.css`. The accent is `green-600`; change `--color-accent` to change it everywhere.
- **Screenshots:** drop them in `public/projects/` and set `image: '/projects/vibething.png'` on the project in `site.ts`. Until then a placeholder box shows.

## Deploy (Cloudflare Workers)

Connected to Cloudflare via Workers Builds: every push to `main` runs `npm run build` then `npx wrangler deploy`.

`worker/index.ts` routes requests and serves `dist/` as static assets (see `wrangler.jsonc`):

| URL | Serves |
| --- | --- |
| `adityajain.ca/` | Main site (`index.html`) |
| `adityajain.ca/atlas` | `atlas/index.html` |
| `adityajain.ca/vibething` | `vibething/index.html` |
| `adityajain.ca/genre` | `genre/index.html` (Spotify Genre Searcher) |
| `adityajain.ca/paladins` | `paladins/index.html` (Crusader Kings III mod) |
| `adityajain.ca/cal` | `cal/index.html`, plus `/cal/calendar.ics` fetched live from the `adityajain13/holidays` repo (cached for an hour) |
| `adityajain.ca/dates` | `dates/index.html` public page; `/dates/log` and `/dates/edit` serve `dates-app/index.html`; `/dates/api/*` and `/dates/auth/*` are the private API and sign-in (`worker/dates.ts`) |

Old subdomain links (`vibething.adityajain.ca/...`, `www.adityajain.ca`) redirect to the paths above; `cal.adityajain.ca/calendar.ics` is still served directly for existing calendar subscribers.

Hosting uses two Worker routes, `adityajain.ca/*` and `*.adityajain.ca/*`, with proxied DNS records `@` and `*` (AAAA `100::`).

To add another project page: create `<name>/index.html` and `src/pages/<name>.tsx`, add the entry to `vite.config.ts`, and add `<name>` to `PAGES` in `worker/index.ts`.

Local preview of the Worker: `npm run build && npx wrangler dev`, then open `http://127.0.0.1:8787/atlas`.

## Private date tracker (dates.adityajain.ca)

- `/dates/log` shows the log, `/dates/edit` edits it, `/dates/api/me` and `/dates/api/dates` are the API. Data is one JSON document in Workers KV (`DATES_KV`, created automatically on deploy).
- **Sign-in:** Cloudflare Access (one-time email codes) protects only `/dates/auth/login`. That route verifies the Access JWT and sets the Worker's own signed `__Host-datelog` cookie: for a year if "Stay signed in" is ticked, otherwise until the browser closes (max one day). `/dates/auth/logout` signs out.
- **Roles** are checked on every request against `DATES_EDITORS` and `DATES_VIEWERS`, so removing an email revokes access immediately. Changing `DATES_SESSION_SECRET` signs everyone out.
- Worker secrets (Settings → Variables and Secrets, type *Secret*): `ACCESS_TEAM`, `ACCESS_AUD`, `DATES_EDITORS`, `DATES_VIEWERS`, `DATES_SESSION_SECRET` (32+ random characters). If any are missing, sign-in and the API refuse every request.
- No personal data is in this repo. Use Export in the editor for backups; Import also accepts the original `pastDates`/`futureDates` format.
- Local testing: create `.dev.vars` (gitignored) with `DEV_AUTH_EMAIL`, `DATES_EDITORS`, `DATES_VIEWERS` and `DATES_SESSION_SECRET`, then `npm run build && npx wrangler dev` and open `http://127.0.0.1:8787/dates/edit`. `DEV_AUTH_EMAIL` stands in for Access and only works on localhost.

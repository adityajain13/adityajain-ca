# adityajain.ca

Personal site. Vite + React + TypeScript + Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Where things live

- **Content:** `src/data/site.ts` holds every project, post, link and the "Currently" list. Search for `TODO` to find the links still to fill in.
- **Colors and fonts:** the `@theme` block in `src/index.css`. The accent is `lime-50`; change `--color-accent` to change it everywhere.
- **Screenshots:** drop them in `public/projects/` and set `image: '/projects/vibething.png'` on the project in `site.ts`. Until then a placeholder box shows.

## Deploy (Cloudflare Workers)

Connected to Cloudflare via Workers Builds: every push to `main` runs `npm run build` then `npx wrangler deploy`.

`worker/index.ts` routes by hostname and serves `dist/` as static assets (see `wrangler.jsonc`):

| Host | Serves |
| --- | --- |
| `adityajain.ca` | Main site (`index.html`) |
| `www.adityajain.ca` | 301 redirect to `adityajain.ca` |
| `atlas.adityajain.ca` | `atlas/index.html` |
| `vibething.adityajain.ca` | `vibething/index.html` |
| `genre.adityajain.ca` | `genre/index.html` (Spotify Genre Searcher) |
| `dates.adityajain.ca` | `dates/index.html` public page; `/log` and `/edit` serve `dates-app/index.html`; `/api/*` is the private API (`worker/dates.ts`) |
| `cal.adityajain.ca` | `cal/index.html`, plus `/calendar.ics` fetched live from the `adityajain13/holidays` repo (cached for an hour) |

Each host must be added as a custom domain on the Worker: Settings → Domains & Routes.

To add another project subdomain: create `<name>/index.html` and `src/pages/<name>.tsx`, add the entry to `vite.config.ts`, add `<name>` to `PAGES` in `worker/index.ts`, then add the custom domain.

Local preview of the Worker: `npm run build && npx wrangler dev`, then `curl -H "Host: atlas.adityajain.ca" localhost:8787`.

## Private date tracker (dates.adityajain.ca)

- `/log` shows the log, `/edit` edits it, `/api/me` and `/api/dates` are the API. Data is one JSON document in Workers KV (`DATES_KV`, created automatically on deploy).
- **Sign-in:** Cloudflare Access (one-time email codes) protects only `/auth/login`. That route verifies the Access JWT and sets the Worker's own signed `__Host-datelog` cookie: for a year if "Stay signed in" is ticked, otherwise until the browser closes (max one day). `/auth/logout` signs out.
- **Roles** are checked on every request against `DATES_EDITORS` and `DATES_VIEWERS`, so removing an email revokes access immediately. Changing `DATES_SESSION_SECRET` signs everyone out.
- Worker secrets (Settings → Variables and Secrets, type *Secret*): `ACCESS_TEAM`, `ACCESS_AUD`, `DATES_EDITORS`, `DATES_VIEWERS`, `DATES_SESSION_SECRET` (32+ random characters). If any are missing, sign-in and the API refuse every request.
- No personal data is in this repo. Use Export in the editor for backups; Import also accepts the original `pastDates`/`futureDates` format.
- Local testing: create `.dev.vars` (gitignored) with `DEV_AUTH_EMAIL`, `DATES_EDITORS`, `DATES_VIEWERS` and `DATES_SESSION_SECRET`, then `npm run build && npx wrangler dev` and open `http://127.0.0.1:8787/edit`. `DEV_AUTH_EMAIL` stands in for Access and only works on localhost.

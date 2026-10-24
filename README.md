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
- **Colors and fonts:** the `@theme` block in `src/index.css`. The accent is `green-400`; change `--color-accent` to change it everywhere.
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
- **Cloudflare Access** protects `/log`, `/edit` and `/api` with one-time email codes. The Worker verifies the Access JWT and gives each email a role.
- Worker secrets (Settings → Variables and Secrets, type *Secret*): `ACCESS_TEAM`, `ACCESS_AUD`, `DATES_EDITORS`, `DATES_VIEWERS` (comma-separated emails). If any are missing, the API refuses every request.
- No personal data is in this repo. Use Export in the editor for backups.
- Local testing: create `.dev.vars` (gitignored) with `DEV_AUTH_EMAIL`, `DATES_EDITORS` and `DATES_VIEWERS`, then `npm run build && npx wrangler dev` and open `http://127.0.0.1:8787/edit`. `DEV_AUTH_EMAIL` only works on localhost.

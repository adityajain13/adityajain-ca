# adityajain.ca

My personal site and project pages. Vite, React, TypeScript, Tailwind 4, on Cloudflare Workers.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/, with every public page pre-rendered to static HTML
npm run lint
```

## Editing

- **Projects, links and resume:** all in `src/data/site.ts`.
- **Colours and fonts:** the `@theme` block in `src/index.css`. Change `--color-accent` to change the accent everywhere.
- **Screenshots:** put them in `public/projects/<name>/` and point the project's `image` at them in `site.ts`. A placeholder shows until you do.
- **Pages:** components in `src/pages/`, browser entry points in `src/entries/`, homepage in `src/App.tsx`. Pre-rendering is `src/prerender.tsx` plus `scripts/prerender.mjs`.

### Adding a project page

1. Create `<name>/index.html`, `src/pages/<name>.tsx` and `src/entries/<name>.tsx`.
2. Add it to `vite.config.ts`, `src/prerender.tsx`, and `PAGES` in `worker/index.ts`.
3. Add an OG image at `public/og/<name>.png`.

## Routes

`worker/index.ts` handles routing and serves `dist/` as static assets.

| Path | |
| --- | --- |
| `/` | Homepage |
| `/atlas`, `/vibething`, `/genre`, `/paladins`, `/travel`, `/meals` | Project pages |
| `/cal` | Calendar page. `/cal/calendar.ics` is fetched from the [holidays](https://github.com/adityajain13/holidays) repo and cached for an hour. |
| `/dates` | Public page for the date tracker. `/dates/log` and `/dates/edit` are the private, signed-in app. |

The apps themselves are separate Workers on more specific routes, so they win over this site's `/*`:
[`/travelplanner`](https://github.com/adityajain13/TravelPlanner) and [`/provisions`](https://github.com/adityajain13/atlas-provisions).

Old subdomains (`www.`, `vibething.` and so on) 301 to the paths above. `cal.adityajain.ca/calendar.ics` is still served directly, because calendar apps that subscribed to it may not follow redirects.

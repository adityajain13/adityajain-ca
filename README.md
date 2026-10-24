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

## Deploy (Cloudflare Pages)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command `npm run build`, output directory `dist`.
4. Custom domains → add `adityajain.ca` (and `www`). With DNS on Cloudflare it sets the records for you.

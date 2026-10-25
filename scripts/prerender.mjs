// Fills each built page's empty <div id="root"></div> with its pre-rendered HTML.
// Runs after `vite build` and the SSR build of src/prerender.tsx (see package.json).
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const ssrDir = fileURLToPath(new URL('../dist-ssr/', import.meta.url))
const { pages, render } = await import(`${ssrDir}prerender.js`)

const EMPTY_ROOT = '<div id="root"></div>'

for (const file of Object.keys(pages)) {
  const path = dist + file
  const html = await readFile(path, 'utf8')
  if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: no empty root to fill`)
  await writeFile(path, html.replace(EMPTY_ROOT, `<div id="root">${render(file)}</div>`))
  console.log(`prerendered ${file}`)
}

await rm(ssrDir, { recursive: true, force: true })

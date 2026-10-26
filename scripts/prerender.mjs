// Fills each built page's empty <div id="root"></div> with its pre-rendered HTML,
// and inlines the stylesheet into every page.
// Runs after `vite build` and the SSR build of src/prerender.tsx (see package.json).
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
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

// Inline the CSS. A separate stylesheet can fail to load, for example when a page
// cached from before a deploy asks for a CSS file that no longer exists, and then
// the pre-rendered HTML shows unstyled. With the CSS in the page, that can't happen.
const STYLESHEET = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g
const htmlFiles = (await readdir(dist, { recursive: true })).filter((f) => f.endsWith('.html'))
for (const file of htmlFiles) {
  const path = dist + file
  const html = await readFile(path, 'utf8')
  const hrefs = [...html.matchAll(STYLESHEET)]
  if (hrefs.length === 0) continue
  let out = html
  for (const [tag, href] of hrefs) {
    const css = (await readFile(dist + href.slice(1), 'utf8')).replace(/<\/style/gi, '<\\/style')
    out = out.replace(tag, () => `<style>${css}</style>`)
  }
  await writeFile(path, out)
  console.log(`inlined CSS into ${file}`)
}

await rm(ssrDir, { recursive: true, force: true })

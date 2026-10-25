import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import './index.css'

/**
 * Starts a page in the browser. Pages that were pre-rendered at build time
 * (scripts/prerender.mjs) already have their HTML, so React just attaches to it.
 */
export function mount(page: ReactNode) {
  const root = document.getElementById('root')!
  const app = <StrictMode>{page}</StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}

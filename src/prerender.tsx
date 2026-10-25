// Server-side entry used only at build time to pre-render each public page to HTML,
// so content shows before JavaScript loads and search engines can read it.
// The private date app (/dates/log, /dates/edit) is not pre-rendered.

import { StrictMode, type ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import AtlasPage from './pages/atlas'
import CalPage from './pages/cal'
import DatesPage from './pages/dates'
import GenrePage from './pages/genre'
import PaladinsPage from './pages/paladins'
import TravelPage from './pages/travel'
import VibeThingPage from './pages/vibething'

// Output HTML file (relative to dist/) → page component.
export const pages: Record<string, () => ReactElement> = {
  'index.html': () => <App />,
  'atlas/index.html': () => <AtlasPage />,
  'vibething/index.html': () => <VibeThingPage />,
  'genre/index.html': () => <GenrePage />,
  'paladins/index.html': () => <PaladinsPage />,
  'cal/index.html': () => <CalPage />,
  'dates/index.html': () => <DatesPage />,
  'travel/index.html': () => <TravelPage />,
}

export function render(file: string): string {
  return renderToString(<StrictMode>{pages[file]()}</StrictMode>)
}

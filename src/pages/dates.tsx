import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '../index.css'
import {
  ButtonLink,
  FeatureList,
  PageHero,
  PageSection,
  SubpageLayout,
  type Feature,
} from '../components/Subpage'
import { DateLog } from '../dates/DateLog'
import type { FutureDate, PastDate } from '../dates/types'

const GITHUB = 'https://github.com/adityajain13/date-tracker'

// Made-up example entries for the preview. The real log is private.
const examplePast: PastDate[] = [
  { id: 'e1', num: '1', title: 'Coffee & Talking', emoji: '☕', vibe: 'first sparks' },
  { id: 'e2', num: '2', title: 'Mini Golf → Tacos', emoji: '⛳', vibe: 'playful' },
  { id: 'e3', num: '3', title: 'Museum → Long Walk Home', emoji: '🏛️', vibe: 'adventurous' },
  { id: 'e4', num: '4', title: 'Movie Night In', emoji: '🎬', vibe: 'cozy' },
]
const exampleFuture: FutureDate[] = [
  { id: 'f1', text: 'Stargazing somewhere dark', emoji: '🌌', done: false },
  { id: 'f2', text: 'Pottery class', emoji: '🏺', done: true },
  { id: 'f3', text: 'Pick-your-own strawberries', emoji: '🍓', done: false },
]

const features: Feature[] = [
  {
    title: 'Dates as chapters',
    body: 'Every date gets a number, an emoji and a vibe like “cozy” or “adventurous”, each with its own colour.',
  },
  {
    title: 'Ideas for next time',
    body: 'A checklist of places and plans. Check them off, or log one as the next chapter once you’ve done it.',
  },
  {
    title: 'Private by default',
    body: 'The real log sits behind a sign-in with one-time email codes. Nothing personal is in the public repo.',
  },
  {
    title: 'View and edit access',
    body: 'Some people can read the log, others can also add and change dates. Saves are checked so two editors can’t overwrite each other.',
  },
]

function DatesPage() {
  return (
    <SubpageLayout>
      <PageHero
        title="Date Tracker"
        tagline="A small app for keeping a log of dates as chapters, each with its own vibe, plus a running list of ideas for the next one."
      >
        <ButtonLink href={GITHUB} primary>
          View on GitHub
        </ButtonLink>
        <a
          href="/dates/log"
          className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-[18px] text-[15px] transition-colors hover:border-subtle"
        >
          Sign in
        </a>
      </PageHero>

      <PageSection title="What it looks like">
        <p className="mb-6 max-w-[60ch] text-muted">An example with made-up dates. The real log is private.</p>
        <div
          className="overflow-hidden rounded-xl border border-line bg-[#0d0d0d] pb-12 text-[#f0ece0]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          <DateLog past={examplePast} future={exampleFuture} />
        </div>
      </PageSection>

      <PageSection title="Features">
        <FeatureList features={features} />
      </PageSection>
    </SubpageLayout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DatesPage />
  </StrictMode>,
)

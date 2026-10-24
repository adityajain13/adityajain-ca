import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '../index.css'
import { ButtonLink, PageHero, PageSection, Steps, SubpageLayout, inlineLink } from '../components/Subpage'

const FEED = 'https://adityajain.ca/cal/calendar.ics'
const WEBCAL = FEED.replace('https://', 'webcal://')
const GOOGLE = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(WEBCAL)}`
const SOURCE = 'https://github.com/adityajain13/holidays'

function CopyFeed() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FEED)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); the URL is still selectable.
    }
  }

  return (
    <div className="flex max-w-xl flex-wrap items-stretch gap-2">
      <code className="flex min-h-11 min-w-0 flex-1 items-center rounded-lg border border-line bg-surface px-4 text-[15px] break-all text-fg-soft select-all">
        {FEED}
      </code>
      <button
        type="button"
        onClick={copy}
        className="min-h-11 rounded-lg border border-line-strong px-[18px] text-[15px] transition-colors hover:border-subtle"
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}

function CalPage() {
  return (
    <SubpageLayout>
      <PageHero
        title="Ontario holiday calendar"
        tagline="Ontario statutory holidays and other dates from 1997 to 2030, in one calendar you can subscribe to. Subscribed calendars update on their own when I add dates."
      >
        <ButtonLink href={GOOGLE} primary>
          Add to Google Calendar
        </ButtonLink>
        <a
          href={WEBCAL}
          className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-[18px] text-[15px] transition-colors hover:border-subtle"
        >
          Add to Apple Calendar or Outlook
        </a>
      </PageHero>

      <PageSection title="Subscribe by link">
        <p className="mb-5 max-w-[60ch] leading-relaxed text-muted">
          Any calendar app that supports subscribing from a URL can use this link.
        </p>
        <CopyFeed />
      </PageSection>

      <PageSection title="Adding it manually in Google Calendar">
        <Steps
          steps={[
            'On a computer, open Google Calendar.',
            'Next to “Other calendars” on the left, click + and choose “From URL”.',
            'Paste the link above and click “Add calendar”. It shows up on your phone too.',
          ]}
        />
        <p className="mt-8 text-sm text-subtle">
          Google refreshes subscribed calendars on its own schedule, which can take up to a day. The calendar file
          lives on{' '}
          <a href={SOURCE} target="_blank" rel="noreferrer" className={inlineLink}>
            GitHub
          </a>
          .
        </p>
      </PageSection>
    </SubpageLayout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalPage />
  </StrictMode>,
)

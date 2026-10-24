import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '../index.css'
import {
  ButtonLink,
  FeatureList,
  PageHero,
  PageSection,
  Steps,
  SubpageLayout,
  inlineLink,
  type Feature,
} from '../components/Subpage'

const GITHUB = 'https://github.com/adityajain13/spotify-genre-searcher'
const README = `${GITHUB}#setup`

const flow = [
  { title: 'A song plays on your PC', body: 'Spotify is checked every 30 seconds for what you’re listening to.' },
  { title: 'It’s one of your liked songs', body: 'Anything saved to your Liked Songs counts. Other songs are skipped.' },
  { title: 'A genre search opens', body: 'Your browser opens a Google search for the song, artist and “genre”.' },
]

const notes: Feature[] = [
  {
    title: 'Only on this PC',
    body: 'Playback on your phone, in the car or on other devices is ignored, so tabs never pile up while you’re away.',
  },
  {
    title: 'Once per song',
    body: 'Each song triggers one search when it starts. Pausing or replaying it won’t open another tab.',
  },
  {
    title: 'Stays out of the way',
    body: 'It lives in the system tray with a small green icon. Right-click it to quit.',
  },
  {
    title: 'Light on the API',
    body: 'Checking every 30 seconds stays well within Spotify’s rate limits.',
  },
]

function GenrePage() {
  return (
    <SubpageLayout>
      <PageHero
        icon={
          <img
            src="/projects/genre/tray-icon.png"
            alt="The tool's tray icon, a green music note with a magnifying glass"
            width={72}
            height={72}
            className="[image-rendering:pixelated]"
          />
        }
        title="Spotify Genre Searcher"
        tagline="A small Windows tray tool for figuring out what to call the music you like. When a liked song plays on your PC, it looks up the song's genre for you."
      >
        <ButtonLink href={GITHUB} primary>
          View on GitHub
        </ButtonLink>
      </PageHero>

      <PageSection title="How it works">
        <ol className="grid gap-4 md:grid-cols-3">
          {flow.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-line bg-surface p-6">
              <span className="mb-4 flex size-7 items-center justify-center rounded-full border border-line-strong text-sm text-accent">
                {i + 1}
              </span>
              <h3 className="mb-1 text-lg font-medium">{step.title}</h3>
              <p className="leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection title="Good to know">
        <FeatureList features={notes} />
      </PageSection>

      <PageSection title="Setting it up">
        <Steps
          steps={[
            'You need Windows, Python 3 and a Spotify account. Install the three Python packages it uses: spotipy, pystray and pillow.',
            'Create an app in the Spotify developer dashboard to get a Client ID and Client Secret, and add them to the script along with your PC’s device name.',
            'Run it once to sign in to Spotify. After that, rename it to .pyw so it runs in the background, and add a shortcut to your Startup folder to launch it with Windows.',
          ]}
        />
        <p className="mt-8 text-sm text-subtle">
          The full step-by-step setup is in the{' '}
          <a href={README} target="_blank" rel="noreferrer" className={inlineLink}>
            README on GitHub
          </a>
          . Built with Python, Spotipy and pystray.
        </p>
      </PageSection>
    </SubpageLayout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GenrePage />
  </StrictMode>,
)

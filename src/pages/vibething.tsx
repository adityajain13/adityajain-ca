import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '../index.css'
import {
  ButtonLink,
  FeatureList,
  PageHero,
  PageSection,
  Shot,
  Steps,
  SubpageLayout,
  inlineLink,
  type Feature,
} from '../components/Subpage'

const GITHUB = 'https://github.com/adityajain13/VibeThing'
const RELEASES = `${GITHUB}/releases`
const img = (name: string) => `/projects/vibething/${name}.webp`

const onDevice: Feature[] = [
  {
    title: 'Screens you design',
    body: 'Up to three columns of widgets per screen, as many screens as you want. Swipe between them or give each one a button.',
  },
  {
    title: 'Now playing from anything',
    body: 'Spotify, YouTube, VLC and anything else Windows can see, with a fullscreen player, synced lyrics and what plays next.',
  },
  {
    title: 'Widgets',
    body: 'Calendar from any ICS link, weather, clock, PC stats, a per-app volume mixer, app shortcuts, macros and a timer.',
  },
  {
    title: 'A timer on the dial',
    body: 'Turn the dial to set it. It speeds up the longer you turn, and Windows notifies you when it ends.',
  },
]

const onDesktop: Feature[] = [
  {
    title: 'Drag-and-drop layout',
    body: 'Drag widgets onto screens, and rename or reorder screens. Changes show up on the Car Thing right away.',
  },
  {
    title: 'Live appearance preview',
    body: 'Adjust text size and weight for every widget and the player layout, previewed with your own music, calendar and weather.',
  },
  {
    title: 'Behaviour and controls',
    body: 'Switch screens automatically when music starts, dim on a schedule, and choose what every button and the dial do.',
  },
  {
    title: 'Backup',
    body: 'Export and import all your settings. An existing GlanceThing setup is copied over the first time you open it.',
  },
]

function VibeThingPage() {
  return (
    <SubpageLayout>
      <PageHero
        title="VibeThing"
        tagline="Your Car Thing as a desk companion. Plug a Spotify Car Thing into your PC and use it as a small second screen for music, your calendar, the weather, PC stats and more."
      >
        <ButtonLink href={RELEASES} primary>
          Download for Windows
        </ButtonLink>
        <ButtonLink href={GITHUB}>View on GitHub</ButtonLink>
      </PageHero>

      <div className="pb-12">
        <Shot src={img('carthing-home')} alt="VibeThing home screen showing the current song, calendar and weather" />
      </div>

      <PageSection title="On the Car Thing">
        <FeatureList features={onDevice} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Shot src={img('carthing-glance')} alt="Glance screen with clock and widgets" caption="Glance" />
          <Shot src={img('carthing-pc')} alt="PC screen with system stats and volume mixer" caption="PC stats" />
          <Shot src={img('carthing-lyrics')} alt="Fullscreen player with synced lyrics" caption="Lyrics" />
        </div>
      </PageSection>

      <PageSection title="In the desktop app">
        <FeatureList features={onDesktop} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Shot src={img('desktop-screens')} alt="Desktop app screen editor" caption="Building screens" />
          <Shot src={img('desktop-appearance')} alt="Desktop app appearance settings with live preview" caption="Appearance" />
        </div>
      </PageSection>

      <PageSection title="Getting started">
        <Steps
          steps={[
            <>
              Download the installer or the portable zip from{' '}
              <a href={RELEASES} target="_blank" rel="noreferrer" className={inlineLink}>
                Releases
              </a>
              . VibeThing is built and tested for Windows.
            </>,
            'Run it. The setup guide walks you through flashing your Car Thing if needed, connecting it and choosing a music source.',
            "Once it's connected, VibeThing opens to Customize so you can start building screens. If you use GlanceThing, close it first, since only one app can talk to the Car Thing at a time.",
          ]}
        />
      </PageSection>

      <PageSection title="Credits">
        <p className="max-w-[64ch] leading-relaxed text-muted">
          VibeThing is a customised fork of{' '}
          <a href="https://github.com/BluDood/GlanceThing" target="_blank" rel="noreferrer" className={inlineLink}>
            GlanceThing
          </a>{' '}
          by BluDood. The Car Thing setup, connection and the original app all come from his work. Lyrics come
          from LRCLIB and weather from Open-Meteo. MIT licensed, like GlanceThing.
        </p>
      </PageSection>
    </SubpageLayout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VibeThingPage />
  </StrictMode>,
)

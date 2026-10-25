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

const AMO = 'https://addons.mozilla.org/firefox/addon/atlas-new-tab/'
const GITHUB = 'https://github.com/adityajain13/AtlasNewTab'

// Screenshots are hosted on the Firefox Add-ons listing.
const shots = {
  main: 'https://addons.mozilla.org/user-media/previews/full/377/377613.png?modified=1780445858',
  settings: 'https://addons.mozilla.org/user-media/previews/full/377/377614.png?modified=1780445848',
  links: 'https://addons.mozilla.org/user-media/previews/full/377/377615.png?modified=1780445848',
}

const features: Feature[] = [
  {
    title: 'A new wallpaper every tab',
    body: 'High-resolution Unsplash photos from a search you pick, with credit to the photographer.',
  },
  {
    title: 'Opens instantly',
    body: 'Photos are downloaded ahead of time in the background, so a new tab never waits on the network.',
  },
  {
    title: 'Search with your engines',
    body: 'Turn on the search engines you use. With just one enabled, the dropdown goes away.',
  },
  {
    title: 'Your own quick links',
    body: 'A grid of circular icons you size yourself. Add, edit and reorder links and set custom icons.',
  },
  {
    title: 'Live settings',
    body: 'Move and resize the search bar and grid, change text sizes and the background dim, and see it update as you go.',
  },
  {
    title: 'Private',
    body: 'Settings stay in your browser and the only requests go to Unsplash. No tracking. Export your setup to move it between devices.',
  },
]

export default function AtlasPage() {
  return (
    <SubpageLayout>
      <PageHero
        title="Atlas New Tab"
        tagline="A new tab page for Firefox with a fresh Unsplash wallpaper every time, a search bar and a grid of quick links you can arrange however you like."
      >
        <ButtonLink href={AMO} primary>
          Get it on Firefox Add-ons
        </ButtonLink>
        <ButtonLink href={GITHUB}>View the source</ButtonLink>
      </PageHero>

      <div className="pb-12">
        <Shot src={shots.main} alt="The Atlas new tab page with a landscape wallpaper, search bar and icon grid" />
      </div>

      <PageSection title="Features">
        <FeatureList features={features} />
      </PageSection>

      <PageSection title="Screenshots">
        <div className="grid gap-6 md:grid-cols-2">
          <Shot src={shots.settings} alt="The Atlas settings panel" caption="Settings panel" />
          <Shot src={shots.links} alt="The Atlas panel for customizing links" caption="Customizing links" />
        </div>
      </PageSection>

      <PageSection title="Getting started">
        <Steps
          steps={[
            <>
              Install Atlas from{' '}
              <a href={AMO} target="_blank" rel="noreferrer" className={inlineLink}>
                Firefox Add-ons
              </a>
              .
            </>,
            <>
              Create a free app on the{' '}
              <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" className={inlineLink}>
                Unsplash developer portal
              </a>{' '}
              and copy its Access Key.
            </>,
            'Open a new tab and paste the key on the setup screen. It stays in your browser and is never included in exports.',
          ]}
        />
        <p className="mt-8 text-sm text-subtle">Photos are provided by photographers on Unsplash through the Unsplash API.</p>
      </PageSection>
    </SubpageLayout>
  )
}

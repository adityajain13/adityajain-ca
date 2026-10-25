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

const img = (name: string) => `/projects/atlas/${name}.webp`

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
        <Shot
          src={img('new-tab')}
          alt="The Atlas new tab page with a misty forest wallpaper, search bar and icon grid"
          width={1533}
          height={1290}
          eager
        />
      </div>

      <PageSection title="Features">
        <FeatureList features={features} />
      </PageSection>

      <PageSection title="Screenshots">
        <div className="grid items-start gap-6 md:grid-cols-3">
          <Shot
            src={img('settings-panel')}
            alt="The Atlas settings panel with wallpaper, search engine, search bar and icon grid options"
            caption="Settings panel"
            width={456}
            height={1286}
          />
          <Shot
            src={img('customize-links')}
            alt="The Customize Links panel with a label and URL for each of ten links"
            caption="Customizing links"
            width={634}
            height={1007}
          />
          <Shot
            src={img('settings-button')}
            alt="The settings button on the right edge of the page"
            caption="The settings button stays tucked away on the right edge until you hover over it."
            width={845}
            height={485}
          />
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

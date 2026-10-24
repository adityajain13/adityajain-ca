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
  SubpageLayout,
  type Feature,
} from '../components/Subpage'

const STEAM = 'https://steamcommunity.com/sharedfiles/filedetails/?id=3826557935'

const regiments = [
  {
    name: 'Paladin Infantry',
    size: '1,000 per regiment',
    body: 'Plate-armoured line troops with 100 in every combat stat.',
    counters: 'Counters pikemen',
  },
  {
    name: 'Paladin Cavalry',
    size: '500 per regiment',
    body: 'Shock cavalry with 150 damage, 150 toughness and 200 pursuit. Strongest on plains and drylands.',
    counters: 'Counters archers',
  },
  {
    name: 'Paladin Crossbows',
    size: '1,000 per regiment',
    body: '250 damage plus siege value, and they hit harder on hills.',
    counters: 'Counters heavy infantry and heavy cavalry',
  },
  {
    name: 'Paladin Bombards',
    size: '100 per regiment',
    body: 'Siege weapons with 125 toughness and a siege value of 25, so castles fall fast. They stay out of the main battle phase.',
    counters: 'Siege',
  },
]

const perks: Feature[] = [
  { title: 'Free', body: 'All four regiments cost 0 gold to hire and 0 to maintain.' },
  { title: 'Players only', body: 'The AI can never recruit them, so your enemies are stuck with normal armies.' },
  {
    title: 'Available from day one',
    body: 'A new game gives your culture Arched Saddle and Bombard, so the cavalry and bombards work in any era.',
  },
  {
    title: 'Works with most mods',
    body: 'It only adds new regiment types and doesn’t overwrite vanilla men-at-arms, so it should run alongside most other mods.',
  },
]

function PaladinsPage() {
  return (
    <SubpageLayout>
      <PageHero
        icon={
          <img
            src="/projects/paladins/icon.webp"
            alt="Paladins mod icon: an armoured knight"
            width={88}
            height={88}
            className="rounded-xl border border-line"
          />
        }
        title="Paladins"
        tagline="A Crusader Kings III mod that adds four absurdly powerful men-at-arms regiments. They’re free to hire and keep, and only you can recruit them."
      >
        <ButtonLink href={STEAM} primary>
          Subscribe on Steam Workshop
        </ButtonLink>
      </PageHero>

      <div className="pb-12">
        <Shot
          src="/projects/paladins/banner.webp"
          alt="Paladins: four elite men-at-arms. Paladin Infantry, Cavalry, Crossbows and Bombards"
        />
        <p className="mt-4 text-sm text-subtle">
          This is a cheat mod. If you want a balanced game, it isn’t for you. If you want to flatten Europe with an army
          of unstoppable knights, it is.
        </p>
      </div>

      <PageSection title="The regiments">
        <ul className="grid gap-4 md:grid-cols-2">
          {regiments.map((r) => (
            <li key={r.name} className="rounded-xl border border-line bg-surface p-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium">{r.name}</h3>
                <span className="text-sm text-subtle">{r.size}</span>
              </div>
              <p className="leading-relaxed text-muted">{r.body}</p>
              <p className="mt-3 text-sm text-accent">{r.counters}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection title="What you get">
        <FeatureList features={perks} />
        <p className="mt-8 text-muted">
          Hire them from the usual Men-at-Arms screen under <span className="text-fg">Create Men-at-Arms Regiment</span>.
        </p>
      </PageSection>

      <PageSection title="Using it on an existing save">
        <p className="mb-4 max-w-[64ch] leading-relaxed text-muted">
          The innovations are only unlocked when you start a new game. On a save you already have, open the console and
          run:
        </p>
        <pre className="overflow-x-auto rounded-xl border border-line bg-surface p-5 text-[14px] leading-relaxed text-fg-soft">
          <code>{'discover_innovation innovation_arched_saddle\ndiscover_innovation innovation_bombard'}</code>
        </pre>
        <p className="mt-6 text-sm text-subtle">
          Found a bug or have an idea? Leave a comment on the{' '}
          <a href={STEAM} target="_blank" rel="noreferrer" className="text-accent underline-offset-4 hover:underline">
            Workshop page
          </a>
          .
        </p>
      </PageSection>
    </SubpageLayout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaladinsPage />
  </StrictMode>,
)

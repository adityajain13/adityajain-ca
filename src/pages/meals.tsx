import {
  ButtonLink,
  FeatureList,
  PageHero,
  PageSection,
  Shot,
  SubpageLayout,
  type Feature,
} from '../components/Subpage'

const GITHUB = 'https://github.com/adityajain13/atlas-provisions'
const APP = '/provisions'
const img = (name: string) => `/projects/provisions/${name}.webp`

const features: Feature[] = [
  {
    title: 'Planned around the flyers',
    body: 'The week’s grocery flyer deals are scored by unit price against recent prices, and the best value in each category goes to the planner.',
  },
  {
    title: 'One call, checked in code',
    body: 'Claude plans the meals and a batch-prep list together. The code then checks the budget, allergies, never-buy items, macros, waste and busy-night time limits, and asks for a fix if anything fails.',
  },
  {
    title: 'Shopping list by store',
    body: 'Quantities round up to whole packs, what’s already in the pantry comes off first, and each item goes to its cheapest store, with price-match hints.',
  },
  {
    title: 'A household, not a template',
    body: 'Who eats which meals, fixed meals, equipment, allergies and time caps are saved as defaults. Change one week for guests or a night out without touching them.',
  },
  {
    title: 'Pantry with use-by dates',
    body: 'Tracks what’s on hand and can favour ingredients that are about to expire.',
  },
  {
    title: 'Receipt scanning',
    body: 'Snap a receipt to record prices and add food to the pantry, using the same reader as Atlas Journeys.',
  },
  {
    title: 'Cravings and ratings',
    body: 'Add cravings for the week. Liked meals can come back and disliked ones are skipped.',
  },
  {
    title: 'Desktop and phone',
    body: 'A full desktop layout with the whole week at a glance, and a phone layout for the store.',
  },
]

const steps: [string, string][] = [
  ['Ingest', 'Flyer items are read into one shape: store, name, price, size and dates.'],
  ['Normalize', 'Each item is matched to an ingredient and its size converted to a common unit.'],
  ['Score', 'The cheapest unit price per store is compared with price history, and the top picks per category are kept.'],
  ['Plan', 'One Claude call returns the meals and the prep list. The code, not the model, works out the cost.'],
  ['Validate', 'Budget, allergens and the other rules are checked, with up to three attempts to fix a failing plan.'],
  ['List', 'The saved plan becomes a shopping list, split by store.'],
]

const stack: [string, string][] = [
  ['App', 'React, TypeScript, Vite, Tailwind CSS and React Router'],
  ['API', 'Hono on Cloudflare Workers, with a D1 (SQLite) database'],
  ['Shared', 'TypeScript types, zod schemas and the planning logic, used by both sides'],
  ['AI', 'Claude for the weekly plan, prep lists and receipt reading'],
  ['Sign-in', 'Email codes for an allow-list of addresses'],
  ['Tests', 'Vitest'],
]

export default function MealsPage() {
  return (
    <SubpageLayout>
      <PageHero
        icon={<img src="/projects/provisions/icon.svg" alt="Atlas Provisions icon: a green globe" width={88} height={88} />}
        title="Atlas Provisions"
        tagline="A weekly meal planner, and another of my Atlas apps. It plans a week of home-cooked meals around local grocery flyer deals, a budget and what everyone in the house can eat, then builds the shopping list and a prep list."
      >
        <a
          href={APP}
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-[18px] text-[15px] font-semibold text-ink transition hover:brightness-110"
        >
          Sign in
        </a>
        <ButtonLink href={GITHUB}>View on GitHub</ButtonLink>
      </PageHero>

      <div className="pb-12">
        <Shot
          src={img('week-full')}
          alt="The week view: breakfasts, lunches and dinners for each day with who's eating and the cost, and a $129.71 of $150 budget bar"
          caption="A planned week, with leftovers, cravings and the budget."
          width={1440}
          height={900}
          eager
        />
        <p className="mt-4 text-sm text-subtle">
          Sign-in is limited to approved emails. The flyer import uses sample data for now; live flyers are next.
        </p>
      </div>

      <PageSection title="Features">
        <FeatureList features={features} />
      </PageSection>

      <PageSection title="Screenshots">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <Shot
            src={img('plan')}
            alt="Planning a week: budget, cravings and who is eating each meal, with changed cells outlined"
            caption="Plan this week: budget, cravings and who’s eating"
            width={1440}
            height={900}
          />
          <Shot
            src={img('list')}
            alt="Shopping list with one column per store and price-match hints"
            caption="Shopping list, one column per store"
            width={1440}
            height={900}
          />
          <Shot
            src={img('meal')}
            alt="A meal's ingredients, steps and ratings"
            caption="Meal detail: ingredients, steps and ratings"
            width={1440}
            height={900}
          />
          <Shot
            src={img('household')}
            alt="Household settings: people, schedule, allergies, equipment and variety rules"
            caption="Household defaults"
            width={1440}
            height={900}
          />
          <Shot
            src={img('pantry')}
            alt="Pantry with use-by dates and items expiring soon"
            caption="Pantry and use-by dates"
            width={1440}
            height={900}
          />
          <Shot
            src={img('login')}
            alt="Sign-in screen asking for an email to send a code to"
            caption="Sign in with an emailed code"
            width={1440}
            height={900}
          />
        </div>
        <div className="mt-6 max-w-[260px]">
          <Shot src={img('phone-week')} alt="The week view on a phone" caption="On a phone" width={390} height={844} />
        </div>
      </PageSection>

      <PageSection title="How a week gets planned">
        <ol className="flex max-w-[64ch] flex-col gap-4">
          {steps.map(([k, v], i) => (
            <li key={k} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-sm text-accent">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed text-fg-soft">
                <span className="font-medium text-fg">{k}.</span> {v}
              </span>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection title="How it’s built">
        <dl className="grid max-w-[72ch] gap-x-8 gap-y-3 sm:grid-cols-[140px_1fr]">
          {stack.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-medium">{k}</dt>
              <dd className="mb-2 text-muted sm:mb-0">{v}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection title="Credits">
        <p className="max-w-[64ch] leading-relaxed text-muted">
          The idea of planning meals around the weekly grocery flyers came from my girlfriend, Nivi.
        </p>
      </PageSection>
    </SubpageLayout>
  )
}

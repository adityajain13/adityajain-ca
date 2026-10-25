import {
  ButtonLink,
  FeatureList,
  PageHero,
  PageSection,
  Shot,
  SubpageLayout,
  type Feature,
} from '../components/Subpage'

const GITHUB = 'https://github.com/adityajain13/TravelPlanner'
const APP = '/travelplanner'
const img = (name: string) => `/projects/travel/${name}.webp`

const features: Feature[] = [
  {
    title: 'Plan day by day',
    body: 'Days come from the trip dates, plus lists like “Places to visit”. Drag stops within and between days, and give each a time, notes and a cost.',
  },
  {
    title: 'Real routes between stops',
    body: 'Each leg shows the drive, walk, bike or transit time, the map draws the actual route, and every day shows its total travel.',
  },
  {
    title: 'A dark map',
    body: 'Numbered, colour-coded pins for each day on a dark vector map, with a satellite toggle. Places come from OpenStreetMap.',
  },
  {
    title: 'Reservations',
    body: 'Flights, stays, rental cars, trains and restaurants, with confirmation numbers and times. They show up on the right days.',
  },
  {
    title: 'Budget and splitting',
    body: 'Costs from bookings and stops add up by category, in any currency. Add who paid and who it’s split between, and it works out who owes whom.',
  },
  {
    title: 'Works offline',
    body: 'An installable app that keeps trips on the device, so it opens instantly with no signal. Maps for a trip’s area can be saved too.',
  },
  {
    title: 'Live sync and sharing',
    body: 'Trips sync across devices and edits made offline merge when you reconnect. Share view-only or can-edit links that work without an account.',
  },
  {
    title: 'Bring trips in',
    body: 'Import a Wanderlog trip from its PDF, parsed on your device. Forward booking emails to have them matched to the right trip.',
  },
  {
    title: 'Claude connector',
    body: 'Paste a share link into Claude and it can read the trip, or change it with approval for every edit.',
  },
  {
    title: 'No paywall',
    body: 'Offline access, dark mode and everything else are just there. No Pro tier and no ads.',
  },
]

const stack: [string, string][] = [
  ['App', 'React, TypeScript, Vite and Tailwind CSS, installable as a PWA'],
  ['Trip data', 'A Yjs document per trip, stored in IndexedDB, so edits merge cleanly'],
  ['Sync', 'A Cloudflare Durable Object per trip over WebSockets, with a D1 index'],
  ['Sign-in', 'Email codes from the Worker and a one-year rolling session'],
  ['Map', 'MapLibre with Protomaps vector tiles and MapTiler satellite'],
  ['Routing', 'OSRM for driving, walking and cycling, and Transitous for transit'],
]

export default function TravelPage() {
  return (
    <SubpageLayout>
      <PageHero
        title="Travel Planner"
        tagline="My own take on Wanderlog. A trip planner that works offline, is dark down to the map, and syncs live, with reservations, a shared budget and routes between every stop."
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
          src={img('tabs')}
          alt="An imported Iceland trip in three tabs: the day-by-day itinerary, reservations and the budget split"
          caption="Itinerary, reservations and budget for a trip imported from Wanderlog."
          width={1464}
          height={900}
          eager
        />
        <p className="mt-4 text-sm text-subtle">
          Sign-in is limited to approved emails. Share links work for anyone, without an account.
        </p>
      </div>

      <PageSection title="Features">
        <FeatureList features={features} />
      </PageSection>

      <PageSection title="Screenshots">
        <div className="flex flex-col gap-6">
          <Shot src={img('trips')} alt="The trip list with a past trip to Iceland" caption="Your trips" width={800} height={420} />
          <div className="grid items-start gap-6 md:grid-cols-3">
            <Shot
              src={img('login')}
              alt="The sign-in screen asking for an email to send a code to"
              caption="Sign in with an emailed code"
              width={600}
              height={520}
            />
            <Shot
              src={img('import')}
              alt="Importing a Wanderlog PDF: 83 places, 2 flights, 4 stays and a car rental found"
              caption="Importing a Wanderlog trip"
              width={480}
              height={560}
            />
            <Shot
              src={img('share')}
              alt="Share dialog with view-only and can-edit links"
              caption="View-only and can-edit share links"
              width={480}
              height={440}
            />
          </div>
        </div>
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
        <p className="mt-8 text-sm text-subtle">
          Map data © OpenStreetMap contributors, Protomaps and MapTiler. Routing by FOSSGIS OSRM and Transitous.
        </p>
      </PageSection>
    </SubpageLayout>
  )
}

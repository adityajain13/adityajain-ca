// All the site's content lives here. Edit this file to change copy, add
// projects or the resume — the components just render it.

export const site = {
  name: 'Aditya Jain',
  email: 'aditya@adityajain.ca',
  links: {
    github: 'https://github.com/adityajain13',
    linkedin: 'https://www.linkedin.com/in/aditya-jain-a70ab8b2',
    firefoxAddons: 'https://addons.mozilla.org/firefox/addon/atlas-new-tab/',
  },
}

export type FeaturedProject = {
  name: string
  description: string
  tags: string[]
  links: { label: string; href: string }[]
  image?: string // put screenshots in /public/projects/ and reference as '/projects/x.webp'
  imageAlt: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    name: 'VibeThing',
    description:
      'My fork of GlanceThing that turns a retired Spotify Car Thing into a desk display connected to my PC.',
    tags: ['React', 'Electron'],
    links: [
      { label: 'Project page', href: '/vibething' },
      { label: 'View on GitHub', href: 'https://github.com/adityajain13/VibeThing' },
    ],
    image: '/projects/vibething/carthing-home.webp',
    imageAlt: 'VibeThing home screen on the Car Thing, showing the current song, calendar and weather',
  },
  {
    name: 'Atlas',
    description:
      'A new-tab page for Firefox with Unsplash wallpapers, multi-engine search and a customizable icon grid. Published on Firefox Add-ons, now at version 1.4.3.',
    tags: ['Browser extension', 'Unsplash API'],
    links: [
      { label: 'Project page', href: '/atlas' },
      { label: 'Get it on Firefox Add-ons', href: 'https://addons.mozilla.org/firefox/addon/atlas-new-tab/' },
      { label: 'View on GitHub', href: 'https://github.com/adityajain13/AtlasNewTab' },
    ],
    // Hosted on Atlas's Firefox Add-ons listing (same image the AtlasNewTab README uses)
    image: 'https://addons.mozilla.org/user-media/previews/full/377/377613.png?modified=1780445858',
    imageAlt: 'The Atlas new tab page with a landscape wallpaper, search bar and icon grid',
  },
]

export type OtherProject = {
  name: string
  description: string
  tag: string
  href?: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'Ontario Holiday Calendar',
    description: 'Statutory holidays and other dates from 1997 to 2030.',
    tag: 'ICS',
    href: '/cal',
  },
  {
    name: 'Date Tracker',
    description: 'Logs past dates and saves ideas for future ones.',
    tag: 'React',
    href: '/dates',
  },
  {
    name: 'Spotify Genre Searcher',
    description: 'Opens a genre search for each liked song as it plays.',
    tag: 'Python',
    href: '/genre',
  },
  {
    name: 'Paladins Mod for CK3',
    description: 'Four overpowered, player-only men-at-arms for Crusader Kings III.',
    tag: 'Game mod',
    href: '/paladins',
  },
]

// Resume shown on the homepage. Update this when the resume changes.
// The PDF lives at public/Aditya_Jain_Resume.pdf; replace that file to update it.
export const resume = {
  pdf: '/Aditya_Jain_Resume.pdf',
  summary:
    'Front-end developer with 5+ years building and owning the customer-facing e-commerce experience for tsc.ca, the Rogers-owned national retailer with about 800K monthly visits.',
  experience: [
    {
      company: 'Rogers Communications · TSC (tsc.ca)',
      role: '.NET & Front-End Developer',
      dates: 'May 2021 – Present',
      points: [
        'One of two front-end developers for tsc.ca. I own features end to end, from Figma mocks to production, shipping a major feature and 2–4 enhancements every sprint.',
        'Migrated the entire legacy Angular front end to React and TypeScript, including the shopping bag, My Account and the live TV schedule.',
        'Redesigned the Algolia-powered product search page as part of a customer retention push that increased add-to-cart rates.',
        'Built front-end features for the TSC Marketplace, which lets hundreds of third-party vendors sell on tsc.ca.',
        'Wrote custom Contentful plugins so the content team can configure site components without waiting for a deployment.',
        'Built reusable, screen-reader-tested React, TypeScript and Tailwind components used across the site, and fixed dozens of Lighthouse performance findings.',
        'Mentor new developers, represent front end in sprint planning, and maintain C#/.NET services such as internal gift card tools.',
      ],
    },
    {
      company: 'Royal Bank of Canada',
      role: 'Developer (Co-op)',
      dates: 'May – Aug 2019',
      points: ['Built REST APIs in C# and .NET Core, and reusable API templates that cut duplicated code across the team.'],
    },
    {
      company: 'Royal Bank of Canada',
      role: 'Technical Analyst (Co-op)',
      dates: 'May – Aug 2017',
      points: ['Built a Java webhook framework that automated manual CI steps, and rewrote the team’s technical documentation.'],
    },
  ],
  education: [
    {
      degree: 'MSc Computer Science (Artificial Intelligence)',
      school: 'University of York',
      year: '2024',
      note: 'Part-time online while working full-time. Capstone: an AI smart mirror that suggests outfits from the live weather.',
    },
    { degree: 'BSc Computer Science', school: 'University of Windsor', year: '2020' },
  ],
  certifications: ['Microsoft Azure Fundamentals (AZ-900)', 'Microsoft Azure AI Fundamentals (AI-900)'],
  skills: [
    { group: 'Front end', items: 'React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, React Query, Webpack, Vite' },
    { group: 'CMS, search & APIs', items: 'Contentful (incl. custom plugins), Algolia, REST APIs' },
    { group: 'Back end', items: 'C#, .NET / .NET Core, Node.js, SQL, Python' },
    { group: 'Practices', items: 'Performance (Lighthouse), accessibility, A/B testing, feature flags, code review, Agile' },
    { group: 'Tools', items: 'Git, Azure DevOps, Azure, CI/CD, SonarQube, Docker, Figma, Jira, AI coding assistants' },
  ],
}

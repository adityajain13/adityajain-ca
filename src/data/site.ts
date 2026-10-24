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
// To offer the PDF too, put it in public/ (e.g. public/resume.pdf) and set pdf: '/resume.pdf'.
export const resume = {
  pdf: '',
  experience: [
    {
      company: 'Rogers Communications',
      role: 'Frontend Engineer',
      dates: 'May 2021 – Present',
      points: [
        'Led the migration of 10+ Angular components to React.',
        'Build reusable React components with TypeScript and Tailwind that standardize UI across pages and features.',
        'Integrated Contentful CMS and Algolia search, and wrote custom Contentful plugins for complex content workflows.',
        'Work with backend teams on REST APIs and keep quality up through code reviews and SonarQube.',
      ],
    },
    {
      company: 'Royal Bank of Canada',
      role: 'Developer',
      dates: 'May – Aug 2019',
      points: ['Built REST APIs and reusable API templates in C# and .NET Core.'],
    },
    {
      company: 'Royal Bank of Canada',
      role: 'Technical Analyst',
      dates: 'May – Aug 2017',
      points: ['Wrote a Java webhook framework to automate builds and supported cloud deployment and QA workflows.'],
    },
    {
      company: 'Design Tech',
      role: 'IT & Administrative Consultant',
      dates: '2012 – 2015',
      points: ['Helped build client websites.'],
    },
  ],
  education: [
    { degree: 'MSc Computer Science (Artificial Intelligence)', school: 'University of York, UK', year: '2024' },
    { degree: 'BSc Computer Science', school: 'University of Windsor', year: '2020' },
  ],
  certifications: ['Microsoft Azure Fundamentals', 'Microsoft Azure AI Fundamentals'],
  skills: [
    { group: 'Frontend', items: 'React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS' },
    { group: 'Backend & data', items: 'C#, .NET Core, REST APIs, SQL, Contentful, Algolia' },
    { group: 'Tools', items: 'Git, Azure DevOps, CI/CD pipelines, Jira' },
  ],
}

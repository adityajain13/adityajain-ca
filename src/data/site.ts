// All the site's content lives here. Edit this file to change copy, add
// projects or posts — the components just render it.

export const site = {
  name: 'Aditya Jain',
  email: 'aditya@adityajain.ca',
  links: {
    github: 'https://github.com/adityajain13',
    linkedin: '', // TODO: add your LinkedIn URL
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
      { label: 'Project page', href: 'https://vibething.adityajain.ca' },
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
      { label: 'Project page', href: 'https://atlas.adityajain.ca' },
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
    href: 'https://cal.adityajain.ca',
  },
  {
    name: 'Date Tracker',
    description: 'Logs past dates and saves ideas for future ones.',
    tag: 'React',
  },
  {
    name: 'Spotify Tray Tool',
    description: 'Opens genre searches for songs I like as they play.',
    tag: 'Python',
  },
  {
    name: 'Paladins Mod for CK3',
    description: 'Adds four new men-at-arms units to Crusader Kings III.',
    tag: 'Game mod',
  },
]

export type Post = {
  title: string
  date?: string // e.g. '2026-11-02'; leave empty while it's a draft
  href?: string
}

export const posts: Post[] = [
  { title: 'Forking GlanceThing for the Car Thing' },
  { title: 'Publishing a Firefox new-tab extension' },
  { title: 'Making a calendar people can subscribe to' },
]

export const currently = {
  updated: 'October 2026',
  items: ['Working on VibeThing', 'Adding features to the date tracker', 'Building this site'],
}

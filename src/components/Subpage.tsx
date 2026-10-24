import type { ReactNode } from 'react'
import { site } from '../data/site'

// Shared building blocks for the project subdomains (atlas., vibething., cal.).
// Links back to the main site are absolute because these pages live on other hostnames.

const HOME = 'https://adityajain.ca'

export function SubpageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1040px] px-4 sm:px-8 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-7">
        <a href={HOME} className="text-[17px] font-semibold">
          {site.name}
        </a>
        <a href={`${HOME}/#projects`} className="text-[15px] text-muted transition-colors hover:text-fg">
          All projects
        </a>
      </header>
      <main>{children}</main>
      <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line py-8 text-sm text-subtle">
        <span>
          Made by <a href={HOME} className="text-muted hover:text-fg">{site.name}</a>
        </span>
        <a href={`mailto:${site.email}`} className="text-muted hover:text-fg">
          {site.email}
        </a>
      </footer>
    </div>
  )
}

export function PageHero({
  title,
  tagline,
  icon,
  children,
}: {
  title: string
  tagline: string
  icon?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="pt-16 pb-12 sm:pt-20 lg:pt-24">
      {icon ? <div className="mb-8">{icon}</div> : null}
      <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tighter sm:text-6xl">{title}</h1>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fg-soft sm:text-xl">{tagline}</p>
      {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
    </section>
  )
}

export function ButtonLink({
  href,
  children,
  primary = false,
}: {
  href: string
  children: ReactNode
  primary?: boolean
}) {
  const base = 'inline-flex min-h-11 items-center rounded-lg px-[18px] text-[15px] transition'
  const style = primary
    ? 'bg-accent font-semibold text-white hover:brightness-110'
    : 'border border-line-strong hover:border-subtle'
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${base} ${style}`}>
      {children}
    </a>
  )
}

export function Shot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="flex flex-col gap-3">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full rounded-xl border border-line bg-black"
      />
      {caption ? <figcaption className="text-sm text-subtle">{caption}</figcaption> : null}
    </figure>
  )
}

export function PageSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <h2 className="mb-6 text-[28px] font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

export type Feature = { title: string; body: string }

export function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
      {features.map((f) => (
        <li key={f.title}>
          <h3 className="mb-1 text-lg font-medium">{f.title}</h3>
          <p className="leading-relaxed text-muted">{f.body}</p>
        </li>
      ))}
    </ul>
  )
}

export function Steps({ steps }: { steps: ReactNode[] }) {
  return (
    <ol className="flex max-w-[64ch] flex-col gap-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-sm text-accent">
            {i + 1}
          </span>
          <span className="pt-0.5 leading-relaxed text-fg-soft">{step}</span>
        </li>
      ))}
    </ol>
  )
}

export const inlineLink = 'text-accent underline-offset-4 hover:underline'

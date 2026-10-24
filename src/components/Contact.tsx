import { site } from '../data/site'

const year = new Date().getFullYear()

export function Contact() {
  const socials = [
    { label: 'GitHub', href: site.links.github },
    { label: 'LinkedIn', href: site.links.linkedin },
    { label: 'Firefox Add-ons', href: site.links.firefoxAddons },
  ].filter((s) => s.href)

  return (
    <footer id="contact" className="scroll-mt-8 border-t border-line pt-14 pb-10 sm:pt-20 lg:pt-24">
      <h2 className="mb-3 text-[28px] font-semibold tracking-tight">Contact</h2>
      <p className="mb-5 max-w-[52ch] text-muted">The best way to reach me is by email.</p>
      <a
        href={`mailto:${site.email}`}
        className="text-2xl font-semibold break-words text-accent underline-offset-8 hover:underline sm:text-4xl"
      >
        {site.email}
      </a>

      <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-subtle">
        <ul className="flex flex-wrap gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <span>© {year} {site.name}</span>
      </div>
    </footer>
  )
}

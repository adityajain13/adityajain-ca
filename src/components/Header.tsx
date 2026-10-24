import { site } from '../data/site'

const nav = [
  { label: 'Projects', href: '#projects' },
  { label: 'Writing', href: '#writing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-7">
      <a href="/" className="text-[17px] font-semibold">
        {site.name}
      </a>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap gap-7 text-[15px]">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-muted transition-colors hover:text-fg">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

import type { ReactNode } from 'react'

type Props = {
  id?: string
  title: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, children, className = '' }: Props) {
  const headingId = id ? `${id}-heading` : undefined
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-8 border-t border-line py-12 ${className}`}>
      <h2 id={headingId} className="mb-8 text-[28px] font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

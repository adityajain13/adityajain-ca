import type { ReactNode } from 'react'
import { sortPast, type FutureDate, type PastDate, type Vibe } from './types'

// The look of the original DateTracker.jsx: Georgia, warm off-white, pink accent.

export const VIBE_COLORS: Record<Vibe, string> = {
  'first sparks': '#f4a261',
  playful: '#48cae4',
  adventurous: '#8ecae6',
  'easy & warm': '#e9c46a',
  cozy: '#f9c74f',
  'the one': '#ff6b9d',
  golden: '#ffd60a',
  'silly & sweet': '#c77dff',
  spontaneous: '#52b788',
  creative: '#a8dadc',
  meaningful: '#b5838d',
}

export const PINK = '#ff6b9d'

export function LogShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0d0d0d] pb-20 text-[#f0ece0]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-[120px] -right-[100px] size-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-[100px] -left-[80px] size-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(72,202,228,0.07) 0%, transparent 70%)' }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function LogHeader({ count, kicker = 'our little story' }: { count: number; kicker?: string }) {
  return (
    <header className="px-6 pt-16 pb-10 text-center">
      <p className="mb-4 text-[11px] tracking-[5px] uppercase" style={{ color: PINK }}>
        {kicker}
      </p>
      <h1 className="m-0 text-[clamp(36px,8vw,72px)] leading-[1.1] font-normal tracking-[-1px]">Date Log</h1>
      <p className="mt-3 text-[15px] tracking-[0.5px] text-[#888] italic">
        {count} {count === 1 ? 'date' : 'dates'} down — more to come ♡
      </p>
    </header>
  )
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#333]" />
      <h2 className="m-0 text-[11px] font-normal tracking-[4px] text-[#777] uppercase">{label}</h2>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#333]" />
    </div>
  )
}

export function NumberBadge({ num, vibe }: { num: string; vibe: Vibe }) {
  const accent = VIBE_COLORS[vibe] ?? '#f0ece0'
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px]"
      style={{ background: `${accent}18`, border: `1px solid ${accent}44`, color: accent }}
    >
      {num}
    </span>
  )
}

export function PastRow({ date, trailing }: { date: PastDate; trailing?: ReactNode }) {
  const accent = VIBE_COLORS[date.vibe] ?? '#f0ece0'
  return (
    <li className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 transition hover:border-white/10 hover:bg-white/[0.04]">
      <NumberBadge num={date.num} vibe={date.vibe} />
      <span className="shrink-0 text-xl" aria-hidden={!date.emoji}>
        {date.emoji}
      </span>
      <span className="min-w-0 flex-1 text-[15px] leading-snug text-[#ccc] transition-colors group-hover:text-[#f0ece0]">
        {date.title}
      </span>
      <span
        className="hidden shrink-0 text-[10px] tracking-[1.5px] uppercase opacity-60 transition-opacity group-hover:opacity-100 min-[400px]:block"
        style={{ color: accent }}
      >
        {date.vibe}
      </span>
      {trailing}
    </li>
  )
}

export function Check({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] transition"
      style={{ border: `1.5px solid ${done ? PINK : '#444'}`, background: done ? PINK : 'transparent' }}
    >
      {done ? <span className="text-[#0d0d0d]">✓</span> : null}
    </span>
  )
}

export function FutureText({ idea }: { idea: FutureDate }) {
  return (
    <>
      <span className="shrink-0 text-lg" style={{ opacity: idea.done ? 0.5 : 1 }}>
        {idea.emoji}
      </span>
      <span
        className="min-w-0 flex-1 text-[15px] tracking-[0.2px]"
        style={{ color: idea.done ? '#666' : '#aaa', textDecoration: idea.done ? 'line-through' : 'none' }}
      >
        {idea.text}
      </span>
    </>
  )
}

/** Read-only log, used on /log and for the example on the public page. */
export function DateLog({
  past,
  future,
  kicker,
  footer,
}: {
  past: PastDate[]
  future: FutureDate[]
  kicker?: string
  footer?: ReactNode
}) {
  const sorted = sortPast(past)
  const done = future.filter((f) => f.done).length
  return (
    <>
      <LogHeader count={sorted.length} kicker={kicker} />
      <div className="mx-auto max-w-[680px] px-5">
        <section aria-label="Past dates">
          <Divider label="Chapters" />
          {sorted.length === 0 ? (
            <p className="mt-6 text-center text-[#888] italic">No dates logged yet.</p>
          ) : (
            <ol className="mt-6 flex flex-col gap-2.5">
              {sorted.map((d) => (
                <PastRow key={d.id} date={d} />
              ))}
            </ol>
          )}
        </section>

        <section aria-label="Date ideas" className="mt-12">
          <Divider label="Up Next" />
          {done > 0 ? (
            <p
              className="mt-6 rounded-lg px-5 py-3 text-center text-[13px] tracking-[0.5px]"
              style={{ background: 'rgba(255,107,157,0.06)', border: '1px solid rgba(255,107,157,0.15)', color: PINK }}
            >
              {done} of {future.length} checked off ♡
            </p>
          ) : null}
          <ul className="mt-6 flex flex-col gap-2">
            {future.map((idea) => (
              <li
                key={idea.id}
                className="flex items-center gap-4 rounded-[10px] px-5 py-3.5"
                style={{
                  background: idea.done ? 'rgba(255,107,157,0.06)' : 'rgba(255,255,255,0.015)',
                  border: `1px solid ${idea.done ? 'rgba(255,107,157,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                <Check done={idea.done} />
                <FutureText idea={idea} />
                {idea.done ? <span className="sr-only">(done)</span> : null}
              </li>
            ))}
          </ul>
        </section>
        {footer}
      </div>
    </>
  )
}

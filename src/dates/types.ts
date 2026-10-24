// Shared between the Worker API and the date tracker pages.

export const VIBES = [
  'first sparks',
  'playful',
  'adventurous',
  'easy & warm',
  'cozy',
  'the one',
  'golden',
  'silly & sweet',
  'spontaneous',
  'creative',
  'meaningful',
] as const

export type Vibe = (typeof VIBES)[number]

export type PastDate = {
  id: string
  num: string // usually a whole number, but "35.1" style sub-chapters are allowed
  title: string
  emoji: string
  vibe: Vibe
}

export type FutureDate = {
  id: string
  text: string
  emoji: string
  done: boolean
}

export type DatesDoc = {
  version: number
  updatedAt: string | null
  updatedBy: string | null
  past: PastDate[]
  future: FutureDate[]
}

export type Role = 'editor' | 'viewer'

export type Me = { email: string; role: Role }

export const LIMITS = { entries: 2000, text: 300, emoji: 16, num: 12 }

export const EMPTY_DOC: DatesDoc = { version: 0, updatedAt: null, updatedBy: null, past: [], future: [] }

/** Sort past dates by chapter number (1, 2, … 35, 35.1, 35.2, 36). */
export function sortPast(past: PastDate[]): PastDate[] {
  const key = (n: string) => n.split('.').map((part) => Number(part) || 0)
  return [...past].sort((a, b) => {
    const [a1, a2 = 0] = key(a.num)
    const [b1, b2 = 0] = key(b.num)
    return a1 - b1 || a2 - b2
  })
}

/** Validates untrusted input (API body or an imported file). Returns an error message or null. */
export function validateLists(past: unknown, future: unknown): string | null {
  if (!Array.isArray(past) || !Array.isArray(future)) return 'past and future must be lists'
  if (past.length + future.length > LIMITS.entries) return 'Too many entries'
  const str = (v: unknown, max: number, allowEmpty = false) =>
    typeof v === 'string' && v.length <= max && (allowEmpty || v.trim().length > 0)
  const ids = new Set<string>()
  for (const p of past) {
    if (!p || typeof p !== 'object') return 'Invalid past date'
    const d = p as Record<string, unknown>
    if (!str(d.id, 64) || ids.has(d.id as string)) return 'Each date needs a unique id'
    ids.add(d.id as string)
    if (!str(d.num, LIMITS.num) || !/^\d+(\.\d+)?$/.test(d.num as string)) return `Invalid number "${String(d.num)}"`
    if (!str(d.title, LIMITS.text)) return 'Every past date needs a title'
    if (!str(d.emoji, LIMITS.emoji, true)) return 'Emoji is too long'
    if (!VIBES.includes(d.vibe as Vibe)) return `Unknown vibe "${String(d.vibe)}"`
  }
  for (const f of future) {
    if (!f || typeof f !== 'object') return 'Invalid idea'
    const d = f as Record<string, unknown>
    if (!str(d.id, 64) || ids.has(d.id as string)) return 'Each idea needs a unique id'
    ids.add(d.id as string)
    if (!str(d.text, LIMITS.text)) return 'Every idea needs text'
    if (!str(d.emoji, LIMITS.emoji, true)) return 'Emoji is too long'
    if (typeof d.done !== 'boolean') return 'Invalid done flag'
  }
  return null
}

/** Keeps only the known fields, so nothing extra gets stored. */
export function cleanLists(past: PastDate[], future: FutureDate[]) {
  return {
    past: sortPast(past.map(({ id, num, title, emoji, vibe }) => ({ id, num, title: title.trim(), emoji, vibe }))),
    future: future.map(({ id, text, emoji, done }) => ({ id, text: text.trim(), emoji, done })),
  }
}

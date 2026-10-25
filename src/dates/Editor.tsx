import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Check, Divider, FutureText, LogHeader, PastRow } from './DateLog'
import { PINK } from './colors'
import {
  cleanLists,
  normalizeImport,
  sortPast,
  validateLists,
  VIBES,
  type DatesDoc,
  type FutureDate,
  type Me,
  type PastDate,
  type Vibe,
} from './types'

const newId = () => crypto.randomUUID()

function nextNum(past: PastDate[]) {
  const max = past.reduce((m, d) => Math.max(m, Math.floor(Number(d.num) || 0)), 0)
  return String(max + 1)
}

// ---------- small UI pieces ----------

const input =
  'min-h-11 rounded-lg border border-white/10 bg-black/40 px-3 text-[15px] text-[#f0ece0] placeholder:text-[#666] focus:border-[#ff6b9d]/60 focus:outline-none'

function TextButton({
  children,
  onClick,
  danger,
  label,
}: {
  children: ReactNode
  onClick: () => void
  danger?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`min-h-9 rounded-md px-2.5 font-sans text-[13px] transition-colors ${
        danger ? 'text-[#ff8a8a] hover:bg-[#ff8a8a]/10' : 'text-[#aaa] hover:bg-white/5 hover:text-[#f0ece0]'
      }`}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, type = 'button', disabled }: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="min-h-11 rounded-lg px-4 font-sans text-[14px] font-semibold text-[#0d0d0d] transition hover:brightness-110 disabled:opacity-40"
      style={{ background: PINK }}
    >
      {children}
    </button>
  )
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <span className="flex shrink-0 items-center gap-1 font-sans text-[13px] text-[#ccc]">
      Delete?
      <TextButton danger onClick={onConfirm}>
        Yes
      </TextButton>
      <TextButton onClick={onCancel}>No</TextButton>
    </span>
  )
}

// ---------- forms ----------

function PastForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PastDate
  onSave: (d: PastDate) => void
  onCancel: () => void
}) {
  const [d, setD] = useState(initial)
  const [error, setError] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  useEffect(() => titleRef.current?.focus(), [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d+(\.\d+)?$/.test(d.num.trim())) return setError('Number should look like 12 or 35.1')
    if (!d.title.trim()) return setError('Add a title')
    onSave({ ...d, num: d.num.trim(), title: d.title.trim(), emoji: d.emoji.trim() })
  }

  return (
    <li className="rounded-xl border border-[#ff6b9d]/30 bg-white/[0.03] p-4">
      <form onSubmit={submit} className="flex flex-col gap-3 font-sans">
        <div className="flex flex-wrap gap-3">
          <label className="flex w-20 flex-col gap-1 text-[12px] text-[#999]">
            Number
            <input className={input} value={d.num} inputMode="decimal" onChange={(e) => setD({ ...d, num: e.target.value })} />
          </label>
          <label className="flex w-20 flex-col gap-1 text-[12px] text-[#999]">
            Emoji
            <input className={input} value={d.emoji} maxLength={16} onChange={(e) => setD({ ...d, emoji: e.target.value })} />
          </label>
          <div className="flex min-w-[180px] flex-1 flex-col gap-1 text-[12px] text-[#999]">
            <label htmlFor={`${d.id}-vibe`}>Vibe</label>
            <select
              id={`${d.id}-vibe`}
              className={input}
              value={d.vibe}
              onChange={(e) => setD({ ...d, vibe: e.target.value as Vibe })}
            >
              {VIBES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex flex-col gap-1 text-[12px] text-[#999]">
          What you did
          <input
            ref={titleRef}
            className={input}
            value={d.title}
            maxLength={300}
            placeholder="Dinner → Walk by the lake"
            onChange={(e) => setD({ ...d, title: e.target.value })}
          />
        </label>
        {error ? <p className="text-[13px] text-[#ff8a8a]">{error}</p> : null}
        <div className="flex gap-2">
          <PrimaryButton type="submit">Done</PrimaryButton>
          <TextButton onClick={onCancel}>Cancel</TextButton>
        </div>
      </form>
    </li>
  )
}

function IdeaForm({
  initial,
  onSave,
  onCancel,
  submitLabel = 'Done',
}: {
  initial: FutureDate
  onSave: (d: FutureDate) => void
  onCancel?: () => void
  submitLabel?: string
}) {
  const [d, setD] = useState(initial)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!d.text.trim()) return
    onSave({ ...d, text: d.text.trim(), emoji: d.emoji.trim() })
  }
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 font-sans">
      <label className="flex w-20 flex-col gap-1 text-[12px] text-[#999]">
        Emoji
        <input className={input} value={d.emoji} maxLength={16} onChange={(e) => setD({ ...d, emoji: e.target.value })} />
      </label>
      <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-[12px] text-[#999]">
        Idea
        <input
          className={input}
          value={d.text}
          maxLength={300}
          placeholder="Somewhere you want to go"
          onChange={(e) => setD({ ...d, text: e.target.value })}
        />
      </label>
      <PrimaryButton type="submit" disabled={!d.text.trim()}>
        {submitLabel}
      </PrimaryButton>
      {onCancel ? <TextButton onClick={onCancel}>Cancel</TextButton> : null}
    </form>
  )
}

// ---------- editor ----------

type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved' }
  | { kind: 'error'; message: string }
  | { kind: 'conflict'; latest: DatesDoc }

export function Editor({ me, initial }: { me: Me; initial: DatesDoc }) {
  const [base, setBase] = useState(initial) // last saved version from the server
  const [past, setPast] = useState(initial.past)
  const [future, setFuture] = useState(initial.future)
  const [editing, setEditing] = useState<string | null>(null) // id of the row being edited, or 'new-past'
  const [confirming, setConfirming] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const fileRef = useRef<HTMLInputElement>(null)

  const dirty = useMemo(
    () => JSON.stringify(cleanLists(past, future)) !== JSON.stringify(cleanLists(base.past, base.future)),
    [past, future, base],
  )

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const sorted = sortPast(past)

  const savePast = (d: PastDate) => {
    setPast((list) => (list.some((x) => x.id === d.id) ? list.map((x) => (x.id === d.id ? d : x)) : [...list, d]))
    setEditing(null)
  }
  const saveIdea = (d: FutureDate) => {
    setFuture((list) => (list.some((x) => x.id === d.id) ? list.map((x) => (x.id === d.id ? d : x)) : [...list, d]))
    setEditing(null)
  }
  const logIdea = (idea: FutureDate) => {
    const entry: PastDate = { id: newId(), num: nextNum(past), title: idea.text, emoji: idea.emoji, vibe: 'easy & warm' }
    setPast((list) => [...list, entry])
    setFuture((list) => list.filter((x) => x.id !== idea.id))
    setEditing(entry.id) // open it so the details can be filled in
  }

  const save = async () => {
    setStatus({ kind: 'saving' })
    try {
      const res = await fetch('/dates/api/dates', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ baseVersion: base.version, past, future }),
      })
      const data = await res.json()
      if (res.status === 409) return setStatus({ kind: 'conflict', latest: data.current })
      if (!res.ok) return setStatus({ kind: 'error', message: data.error ?? `Save failed (${res.status})` })
      setBase(data)
      setPast(data.past)
      setFuture(data.future)
      setStatus({ kind: 'saved' })
    } catch {
      setStatus({ kind: 'error', message: 'Could not reach the server. Your changes are still here; try again.' })
    }
  }

  const loadLatest = (doc: DatesDoc) => {
    setBase(doc)
    setPast(doc.past)
    setFuture(doc.future)
    setEditing(null)
    setStatus({ kind: 'idle' })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ past: sortPast(past), future }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `dates-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = async (file: File) => {
    try {
      const data = normalizeImport(JSON.parse(await file.text()))
      const problem = validateLists(data.past, data.future)
      if (problem) return setStatus({ kind: 'error', message: `Couldn't import: ${problem}` })
      setPast(data.past as PastDate[])
      setFuture(data.future as FutureDate[])
      setEditing(null)
      setStatus({ kind: 'idle' })
    } catch {
      setStatus({ kind: 'error', message: "Couldn't import: that file isn't valid JSON" })
    }
  }

  const statusText =
    status.kind === 'saving'
      ? 'Saving…'
      : status.kind === 'error'
        ? status.message
        : dirty
          ? 'Unsaved changes'
          : status.kind === 'saved'
            ? 'All changes saved'
            : base.updatedAt
              ? `Saved ${new Date(base.updatedAt).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
              : 'Nothing saved yet'

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0d0d0d]/90 font-sans backdrop-blur">
        <div className="mx-auto flex max-w-[680px] flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3">
          <span
            role="status"
            className={`min-w-0 flex-1 text-[13px] ${status.kind === 'error' ? 'text-[#ff8a8a]' : dirty ? 'text-[#f0ece0]' : 'text-[#888]'}`}
          >
            {statusText}
          </span>
          <a href="/dates/log" className="min-h-9 content-center rounded-md px-2.5 text-[13px] text-[#aaa] hover:bg-white/5 hover:text-[#f0ece0]">
            View
          </a>
          <TextButton onClick={exportJson}>Export</TextButton>
          <TextButton onClick={() => fileRef.current?.click()}>Import</TextButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void importJson(f)
              e.target.value = ''
            }}
          />
          {dirty ? <TextButton onClick={() => loadLatest(base)}>Discard</TextButton> : null}
          <PrimaryButton onClick={save} disabled={!dirty || status.kind === 'saving'}>
            Save
          </PrimaryButton>
        </div>
        {status.kind === 'conflict' ? (
          <div className="mx-auto flex max-w-[680px] flex-wrap items-center gap-2 px-5 pb-3 text-[13px] text-[#ffd60a]">
            Someone else saved changes since you opened this page.
            <TextButton onClick={() => loadLatest(status.latest)}>Load their version (discards yours)</TextButton>
            <TextButton onClick={() => setBase(status.latest)}>Keep mine and save over it</TextButton>
          </div>
        ) : null}
      </div>

      <LogHeader count={sorted.length} kicker={`editing as ${me.email}`} />

      <div className="mx-auto max-w-[680px] px-5">
        <section aria-label="Past dates">
          <Divider label="Chapters" />
          <ol className="mt-6 flex flex-col gap-2.5">
            {sorted.map((d) =>
              editing === d.id ? (
                <PastForm key={d.id} initial={d} onSave={savePast} onCancel={() => setEditing(null)} />
              ) : (
                <PastRow
                  key={d.id}
                  date={d}
                  trailing={
                    confirming === d.id ? (
                      <ConfirmDelete
                        onConfirm={() => {
                          setPast((list) => list.filter((x) => x.id !== d.id))
                          setConfirming(null)
                        }}
                        onCancel={() => setConfirming(null)}
                      />
                    ) : (
                      <span className="flex shrink-0">
                        <TextButton onClick={() => setEditing(d.id)} label={`Edit ${d.title}`}>
                          Edit
                        </TextButton>
                        <TextButton danger onClick={() => setConfirming(d.id)} label={`Delete ${d.title}`}>
                          Delete
                        </TextButton>
                      </span>
                    )
                  }
                />
              ),
            )}
            {editing === 'new-past' ? (
              <PastForm
                initial={{ id: newId(), num: nextNum(past), title: '', emoji: '', vibe: 'easy & warm' }}
                onSave={savePast}
                onCancel={() => setEditing(null)}
              />
            ) : null}
          </ol>
          {editing !== 'new-past' ? (
            <div className="mt-4">
              <PrimaryButton onClick={() => setEditing('new-past')}>Add a date</PrimaryButton>
            </div>
          ) : null}
        </section>

        <section aria-label="Date ideas" className="mt-12">
          <Divider label="Up Next" />
          <ul className="mt-6 flex flex-col gap-2">
            {future.map((idea) =>
              editing === idea.id ? (
                <li key={idea.id} className="rounded-[10px] border border-[#ff6b9d]/30 bg-white/[0.03] p-4">
                  <IdeaForm initial={idea} onSave={saveIdea} onCancel={() => setEditing(null)} />
                </li>
              ) : (
                <li
                  key={idea.id}
                  className="flex items-center gap-3 rounded-[10px] py-1.5 pr-2 pl-3"
                  style={{
                    background: idea.done ? 'rgba(255,107,157,0.06)' : 'rgba(255,255,255,0.015)',
                    border: `1px solid ${idea.done ? 'rgba(255,107,157,0.2)' : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setFuture((list) => list.map((x) => (x.id === idea.id ? { ...x, done: !x.done } : x)))}
                    aria-pressed={idea.done}
                    className="flex min-h-11 min-w-0 flex-1 items-center gap-4 rounded-md px-2 text-left"
                  >
                    <Check done={idea.done} />
                    <FutureText idea={idea} />
                  </button>
                  {confirming === idea.id ? (
                    <ConfirmDelete
                      onConfirm={() => {
                        setFuture((list) => list.filter((x) => x.id !== idea.id))
                        setConfirming(null)
                      }}
                      onCancel={() => setConfirming(null)}
                    />
                  ) : (
                    <span className="flex shrink-0 flex-wrap justify-end">
                      <TextButton onClick={() => logIdea(idea)} label={`Log ${idea.text} as a date`}>
                        Log it
                      </TextButton>
                      <TextButton onClick={() => setEditing(idea.id)} label={`Edit ${idea.text}`}>
                        Edit
                      </TextButton>
                      <TextButton danger onClick={() => setConfirming(idea.id)} label={`Delete ${idea.text}`}>
                        Delete
                      </TextButton>
                    </span>
                  )}
                </li>
              ),
            )}
          </ul>
          <div className="mt-4 rounded-[10px] border border-white/5 p-4">
            <IdeaForm
              key={future.length}
              initial={{ id: newId(), text: '', emoji: '', done: false }}
              onSave={saveIdea}
              submitLabel="Add idea"
            />
          </div>
          <p className="mt-6 font-sans text-[13px] leading-relaxed text-[#777]">
            Tap an idea to check it off. “Log it” moves it into Chapters as the next date so you can fill in the details.
            Changes aren’t live until you press Save.
          </p>
        </section>
      </div>
    </>
  )
}

// Private app at adityajain.ca/dates/log (view) and /dates/edit (edit).
// Signing in goes through /dates/auth/login (Cloudflare Access email code), which sets a session cookie.

import { useEffect, useState } from 'react'
import { DateLog } from './DateLog'
import { PINK } from './colors'
import { Editor } from './Editor'
import type { DatesDoc, Me } from './types'

type State =
  | { kind: 'loading' }
  | { kind: 'signedOut' }
  | { kind: 'denied' }
  | { kind: 'error' }
  | { kind: 'ready'; me: Me; doc: DatesDoc }

function Message({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-6 pt-32 text-center">
      <h1 className="mb-3 text-3xl font-normal">{title}</h1>
      {children ? <div className="font-sans text-[15px] leading-relaxed text-[#999]">{children}</div> : null}
    </div>
  )
}

const signOut = '/dates/auth/logout'

const REMEMBER_KEY = 'datelog-remember'

function SignIn({ next }: { next: '/dates/log' | '/dates/edit' }) {
  // On by default; the last choice on this device is kept.
  const [remember, setRemember] = useState(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) !== '0'
    } catch {
      return true
    }
  })
  const choose = (on: boolean) => {
    setRemember(on)
    try {
      localStorage.setItem(REMEMBER_KEY, on ? '1' : '0')
    } catch {
      // storage unavailable; the choice still applies to this sign-in
    }
  }
  // Also hand the choice to the Worker in a short-lived cookie, in case the query
  // string is lost on the way through the Access login.
  const startSignIn = () => {
    document.cookie = `datelog_remember=${remember ? '1' : '0'}; Path=/dates/auth; Max-Age=900; Secure; SameSite=Lax`
  }
  return (
    <div className="mx-auto max-w-sm px-6 pt-28 text-center">
      <p className="mb-4 text-[11px] tracking-[5px] uppercase" style={{ color: PINK }}>
        our little story
      </p>
      <h1 className="mb-3 text-[44px] leading-tight font-normal">Date Log</h1>
      <p className="mb-8 font-sans text-[15px] leading-relaxed text-[#999]">
        Sign in with your email. You’ll get a one-time code.
      </p>
      <a
        href={`/dates/auth/login?next=${next}${remember ? '&remember=1' : ''}`}
        onClick={startSignIn}
        className="inline-flex min-h-11 items-center rounded-lg px-5 font-sans text-[15px] font-semibold text-[#0d0d0d] transition hover:brightness-110"
        style={{ background: PINK }}
      >
        Sign in
      </a>
      <label className="mt-6 flex cursor-pointer items-center justify-center gap-2.5 font-sans text-[14px] text-[#bbb]">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => choose(e.target.checked)}
          className="size-4 accent-[#ff6b9d]"
        />
        Stay signed in on this device for a year
      </label>
      <p className="mt-3 font-sans text-[12px] text-[#666]">Leave this off on shared or public computers.</p>
    </div>
  )
}

export default function DatesApp() {
  const wantsEdit = window.location.pathname.startsWith('/dates/edit')
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    document.title = wantsEdit ? 'Edit · Date Log' : 'Date Log'
    ;(async () => {
      try {
        const [meRes, docRes] = await Promise.all([fetch('/dates/api/me'), fetch('/dates/api/dates')])
        if (meRes.status === 401 || docRes.status === 401) {
          return setState({ kind: new URLSearchParams(window.location.search).has('denied') ? 'denied' : 'signedOut' })
        }
        if (meRes.status === 403 || docRes.status === 403) return setState({ kind: 'denied' })
        if (!meRes.ok || !docRes.ok) return setState({ kind: 'error' })
        setState({ kind: 'ready', me: await meRes.json(), doc: await docRes.json() })
      } catch {
        setState({ kind: 'error' })
      }
    })()
  }, [wantsEdit])

  if (state.kind === 'loading') return <Message title="Loading…" />
  if (state.kind === 'signedOut') return <SignIn next={wantsEdit ? '/dates/edit' : '/dates/log'} />
  if (state.kind === 'error') return <Message title="Something went wrong">Couldn’t load the log. Try refreshing.</Message>
  if (state.kind === 'denied') {
    return (
      <Message title="No access">
        That email isn’t on the list for this log.{' '}
        <a href="/cdn-cgi/access/logout" style={{ color: PINK }}>
          Try a different email
        </a>
        .
      </Message>
    )
  }

  const { me, doc } = state

  if (wantsEdit && me.role !== 'editor') {
    return (
      <Message title="View only">
        You can view the log but not edit it. <a href="/dates/log" style={{ color: PINK }}>Go to the log</a>.
      </Message>
    )
  }

  if (wantsEdit) return <Editor me={me} initial={doc} />

  return (
    <DateLog
      past={doc.past}
      future={doc.future}
      footer={
        <nav className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-[13px] text-[#777]">
          {me.role === 'editor' ? (
            <a href="/dates/edit" style={{ color: PINK }}>
              Edit the log
            </a>
          ) : null}
          <span>Signed in as {me.email}</span>
          <a href={signOut} className="hover:text-[#ccc]">
            Sign out
          </a>
        </nav>
      }
    />
  )
}


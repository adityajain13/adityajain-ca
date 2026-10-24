// Private app at dates.adityajain.ca/log (view) and /edit (edit).
// Cloudflare Access handles sign-in before this page loads; the API decides the role.

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '../index.css'
import { DateLog, LogShell, PINK } from './DateLog'
import { Editor } from './Editor'
import type { DatesDoc, Me } from './types'

type State =
  | { kind: 'loading' }
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

const signOut = '/cdn-cgi/access/logout'

function App() {
  const wantsEdit = window.location.pathname.startsWith('/edit')
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    document.title = wantsEdit ? 'Edit · Date Log' : 'Date Log'
    ;(async () => {
      try {
        const [meRes, docRes] = await Promise.all([fetch('/api/me'), fetch('/api/dates')])
        if (meRes.status === 403 || docRes.status === 403) return setState({ kind: 'denied' })
        if (!meRes.ok || !docRes.ok) return setState({ kind: 'error' })
        setState({ kind: 'ready', me: await meRes.json(), doc: await docRes.json() })
      } catch {
        setState({ kind: 'error' })
      }
    })()
  }, [wantsEdit])

  if (state.kind === 'loading') return <Message title="Loading…" />
  if (state.kind === 'error') return <Message title="Something went wrong">Couldn’t load the log. Try refreshing.</Message>
  if (state.kind === 'denied') {
    return (
      <Message title="No access">
        This account isn’t on the list for this log.{' '}
        <a href={signOut} style={{ color: PINK }}>
          Sign in with a different email
        </a>
        .
      </Message>
    )
  }

  const { me, doc } = state

  if (wantsEdit && me.role !== 'editor') {
    return (
      <Message title="View only">
        You can view the log but not edit it. <a href="/log" style={{ color: PINK }}>Go to the log</a>.
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
            <a href="/edit" style={{ color: PINK }}>
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogShell>
      <App />
    </LogShell>
  </StrictMode>,
)

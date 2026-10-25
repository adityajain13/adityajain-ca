// Browser entry for the private date app (adityajain.ca/dates/log and /dates/edit).
import { mount } from '../mount'
import DatesApp from '../dates/DatesApp'
import { LogShell } from '../dates/DateLog'

mount(
  <LogShell>
    <nav aria-label="Site" className="mx-auto max-w-[680px] px-5 pt-5 font-sans text-[13px]">
      <a href="https://adityajain.ca" className="inline-flex min-h-9 items-center gap-1.5 text-[#888] hover:text-[#f0ece0]">
        <span aria-hidden="true">←</span> adityajain.ca
      </a>
    </nav>
    <DatesApp />
  </LogShell>,
)

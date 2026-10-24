import { currently, resume } from '../data/site'

function SideHeading({ children }: { children: string }) {
  return <h3 className="mb-3 text-sm font-medium tracking-wide text-subtle uppercase">{children}</h3>
}

export function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-heading" className="scroll-mt-8 border-t border-line py-12">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="resume-heading" className="text-[28px] font-semibold tracking-tight">
          Resume
        </h2>
        {resume.pdf ? (
          <a
            href={resume.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-[18px] text-[15px] transition-colors hover:border-subtle"
          >
            Download PDF
          </a>
        ) : null}
      </div>

      <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <SideHeading>Experience</SideHeading>
          <ol className="flex flex-col">
            {resume.experience.map((job) => (
              <li key={`${job.company}-${job.role}`} className="border-b border-line py-5 first:pt-0 last:border-b-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-lg font-medium">
                    {job.role} <span className="text-muted">· {job.company}</span>
                  </h4>
                  <span className="text-sm whitespace-nowrap text-subtle">{job.dates}</span>
                </div>
                <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-muted marker:text-line-strong">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <aside className="flex flex-col gap-9">
          <div>
            <SideHeading>Education</SideHeading>
            <ul className="flex flex-col gap-3">
              {resume.education.map((e) => (
                <li key={e.degree}>
                  <p className="font-medium">{e.degree}</p>
                  <p className="text-sm text-muted">
                    {e.school} · {e.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SideHeading>Skills</SideHeading>
            <dl className="flex flex-col gap-3">
              {resume.skills.map((s) => (
                <div key={s.group}>
                  <dt className="font-medium">{s.group}</dt>
                  <dd className="text-sm leading-relaxed text-muted">{s.items}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <SideHeading>Certifications</SideHeading>
            <ul className="flex flex-col gap-1 text-sm text-muted">
              {resume.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h3 className="text-lg font-semibold">Currently</h3>
            <p className="mb-3 text-sm text-subtle">Last updated {currently.updated}</p>
            <ul className="flex list-disc flex-col gap-1.5 pl-[18px] text-fg-soft marker:text-accent">
              {currently.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

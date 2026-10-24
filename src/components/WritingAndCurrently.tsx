import { currently, posts } from '../data/site'

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function WritingAndCurrently() {
  return (
    <section className="grid gap-12 border-t border-line py-12 md:grid-cols-2">
      <div id="writing" className="scroll-mt-8">
        <h2 className="mb-3 text-[28px] font-semibold tracking-tight">Writing</h2>
        <ul>
          {posts.map((post) => {
            const content = (
              <>
                <span>{post.title}</span>
                <span className="text-sm whitespace-nowrap text-subtle">
                  {post.date ? formatDate(post.date) : 'Coming soon'}
                </span>
              </>
            )
            const rowClass = 'flex justify-between gap-4 border-b border-line py-4'
            return (
              <li key={post.title}>
                {post.href ? (
                  <a href={post.href} className={`${rowClass} hover:text-white`}>
                    {content}
                  </a>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="self-start rounded-xl border border-line bg-surface p-7">
        <h2 className="text-xl font-semibold">Currently</h2>
        <p className="mb-4 text-sm text-subtle">Last updated {currently.updated}</p>
        <ul className="flex list-disc flex-col gap-2 pl-[18px] text-fg-soft marker:text-accent">
          {currently.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import { featuredProjects, otherProjects, type FeaturedProject } from '../data/site'
import { Section } from './Section'

function ProjectImage({ project }: { project: FeaturedProject }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt}
        loading="lazy"
        className="aspect-[5/3] w-full rounded-xl border border-line bg-black object-cover object-top"
      />
    )
  }
  // Placeholder until a screenshot is added in data/site.ts
  return (
    <div className="flex aspect-[5/3] items-center justify-center rounded-xl border border-line bg-placeholder p-6 text-center text-[13px] text-subtle">
      [Screenshot: {project.imageAlt}]
    </div>
  )
}

export function Projects() {
  return (
    <>
      <Section id="projects" title="Projects">
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <article key={project.name} className="flex flex-col gap-5">
              <ProjectImage project={project} />
              <div className="flex flex-col gap-2">
                <h3 className="text-[22px] font-semibold tracking-tight">{project.name}</h3>
                <p className="leading-relaxed text-muted">{project.description}</p>
                <p className="mt-1 text-sm text-subtle">{project.tags.join(' · ')}</p>
                {project.links.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[15px] text-accent underline-offset-4 hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Other things I've made">
        <ul className="-mt-4">
          {otherProjects.map((project) => {
            const row = (
              <>
                <span className="flex-[0_1_240px] text-lg font-medium">{project.name}</span>
                <span className="flex-[1_1_320px] text-muted">{project.description}</span>
                <span className="text-sm text-subtle">{project.tag}</span>
              </>
            )
            const rowClass =
              'flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-lg border-b border-line px-3 py-[18px]'
            return (
              <li key={project.name}>
                {project.href ? (
                  <a href={project.href} className={`${rowClass} transition-colors hover:bg-surface`}>
                    {row}
                  </a>
                ) : (
                  <div className={rowClass}>{row}</div>
                )}
              </li>
            )
          })}
        </ul>
      </Section>
    </>
  )
}

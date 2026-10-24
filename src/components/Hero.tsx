export function Hero() {
  return (
    <section id="about" className="scroll-mt-8 py-16 sm:py-24 lg:py-28">
      <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tighter sm:text-6xl lg:text-7xl">
        Hi, I'm Aditya.
      </h1>
      <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-fg-soft sm:text-xl">
        I'm a front-end developer at Rogers, based in Mississauga. Outside of work I build small things
        for myself: an app for my Spotify Car Thing, a Firefox new-tab page, a game mod, and a holiday
        calendar. Some of them are below.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-[18px] text-[15px] font-semibold text-ink transition hover:brightness-110"
        >
          View projects
        </a>
        <a
          href="#contact"
          className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-[18px] text-[15px] transition-colors hover:border-subtle"
        >
          Get in touch
        </a>
      </div>
    </section>
  )
}

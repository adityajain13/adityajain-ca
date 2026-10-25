import { Children, useCallback, useEffect, useState, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

// Horizontal carousel built on Embla. Edges fade out where there's more to scroll,
// with arrow buttons and dots underneath.

const FADE = '56px'

function Arrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
      className="flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'prev' ? <path d="M10 3 5 8l5 5" /> : <path d="m6 3 5 5-5 5" />}
      </svg>
    </button>
  )
}

export function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const [viewportRef, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [snaps, setSnaps] = useState<number[]>([])
  const [selected, setSelected] = useState(0)

  const update = useCallback(() => {
    if (!embla) return
    setCanPrev(embla.canScrollPrev())
    setCanNext(embla.canScrollNext())
    setSnaps(embla.scrollSnapList())
    setSelected(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    update()
    embla.on('select', update).on('reInit', update)
    return () => {
      embla.off('select', update).off('reInit', update)
    }
  }, [embla, update])

  const left = canPrev ? 'transparent' : 'black'
  const right = canNext ? 'transparent' : 'black'
  const mask = `linear-gradient(to right, ${left}, black ${FADE}, black calc(100% - ${FADE}), ${right})`

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={viewportRef}
        className="cursor-grab overflow-hidden select-none active:cursor-grabbing [&_a]:[-webkit-user-drag:none]"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') embla?.scrollPrev()
          if (e.key === 'ArrowRight') embla?.scrollNext()
        }}
      >
        <div className="-ml-6 flex touch-pan-y">
          {Children.map(children, (child, i) => (
            <div
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-6 md:basis-[46%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${Children.count(children)}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1" role="tablist" aria-label="Choose a slide">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className="flex h-11 items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all ${i === selected ? 'w-6 bg-accent' : 'w-2 bg-line-strong hover:bg-subtle'}`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Arrow dir="prev" disabled={!canPrev} onClick={() => embla?.scrollPrev()} />
          <Arrow dir="next" disabled={!canNext} onClick={() => embla?.scrollNext()} />
        </div>
      </div>
    </div>
  )
}

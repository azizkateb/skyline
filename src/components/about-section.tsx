'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const logoSequence = [
  { src: '/logos/logo-4.svg', alt: 'Logo 4' },
  { src: '/logos/logo-3.svg', alt: 'Logo 3' },
  { src: '/logos/logo-2.svg', alt: 'Logo 2' },
  { src: '/logos/logo-1.svg', alt: 'Logo 1' },
  { src: '/logos/logo-4.svg', alt: 'Logo 4' },
  { src: '/logos/logo-3.svg', alt: 'Logo 3' },
  { src: '/logos/logo-2.svg', alt: 'Logo 2' },
  { src: '/logos/logo-1.svg', alt: 'Logo 1' },
]

const poppedIn = {
  opacity: 0,
  scale: 0.95,
  y: 40,
  transformPerspective: 1800,
  translateZ: -2400,
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const barRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pre-set initial hidden state BEFORE paint
    if (!reduced) {
      if (headingRef.current) {
        gsap.set(headingRef.current, poppedIn)
      }
      if (gridRef.current) {
        gsap.set(gridRef.current.children, poppedIn)
      }
    }

    let cancelled = false
    let ctx: gsap.Context | null = null

    const run = () => {
      if (cancelled) return
      ctx = gsap.context(() => {
        if (reduced) {
          if (headingRef.current) {
            gsap.set(headingRef.current, { opacity: 1, scale: 1, y: 0 })
          }
          if (gridRef.current) {
            gsap.set(gridRef.current.children, { opacity: 1, scale: 1, y: 0 })
          }
          return
        }

        const tl = gsap.timeline({ delay: 0 })

        // Heading reveals first
        if (headingRef.current) {
          tl.fromTo(
            headingRef.current,
            poppedIn,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              z: 0,
              duration: 1,
              ease: 'back.out(1.6)',
            }
          )
        }

        // Grid cards stagger in
        if (gridRef.current) {
          tl.fromTo(
            gridRef.current.children,
            poppedIn,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              z: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'back.out(1.6)',
            },
            '-=0.4'
          )
        }

        // Animate counter numbers
        const spans = section.querySelectorAll<HTMLSpanElement>('[data-count]')
        if (spans) {
          spans.forEach((span) => {
            const target = parseFloat(span.dataset.count!)
            const suffix = span.dataset.suffix ?? ''
            const obj = { val: 0 }

            gsap.to(obj, {
              val: target,
              duration: 1.2,
              ease: 'power3.out',
              onUpdate: () => {
                const rounded = Math.round(obj.val)
                if (suffix === '+') span.textContent = `${rounded}+`
                else if (suffix === '%') span.textContent = `${rounded}%`
                else if (suffix === 'k+') span.textContent = `${rounded}k+`
                else span.textContent = String(rounded)
              },
            })
          })
        }

        // Animate bar chart
        barRefs.current.forEach((bar) => {
          if (!bar) return
          const targetHeight = bar.dataset.height || '100%'
          gsap.set(bar, { height: 0 })
          gsap.to(bar, {
            height: targetHeight,
            duration: 0.8,
            ease: 'power3.out',
          })
        })
      }, section)
    }

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        if (!cancelled) run()
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gray-100 py-16 md:py-24">
      <style>{`
@keyframes loop {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.loop {
  display: flex;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  align-items: center;
}
.loop_logos {
  display: flex;
  flex: none;
  min-width: max-content;
  align-items: center;
  justify-content: flex-start;
  gap: clamp(2.75rem, 5vw, 5rem);
  padding-right: clamp(2.75rem, 5vw, 5rem);
  animation: loop 25s linear infinite;
}
.loop_logos img {
  display: block;
  height: clamp(2.25rem, 3.6vw, 2.9rem);
  width: auto;
  flex-shrink: 0;
  opacity: 0.9;
  filter: grayscale(1) brightness(0) invert(0.82);
}
@media (prefers-reduced-motion: reduce) {
  .loop {
    overflow-x: auto;
  }
  .loop_logos {
    animation: none;
    transform: none;
  }
}
`}</style>

      {/* ---- LOGO MARQUEE ---- */}
      <div
        className="loop relative left-1/2 mb-20 py-6 md:py-8 -translate-x-1/2"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        {[0, 1].map((track) => (
          <div key={track} className="loop_logos" aria-hidden={track === 1}>
            {logoSequence.map((logo, i) => (
              <img key={`${track}-${i}`} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        {/* ---- HEADING ---- */}
        <div ref={headingRef} className="mb-16 text-center" style={{ willChange: 'transform, opacity' }}>
          <span className="text-label mb-4 inline-flex items-center gap-2 uppercase tracking-widest text-gray-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
            ABOUT US
          </span>

          <h2
            className="mx-auto max-w-4xl font-bold leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
          >
            <span className="text-gray-900">A global consulting partner</span>
            <br />
            <span className="text-gray-900">
              dedicated to building{' '}
              <span className="mx-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-blue align-middle">
                <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                  <path d="M10 1.5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0110 1.5zM14.24 3.76a.75.75 0 011.06 0l1.77 1.77a.75.75 0 11-1.06 1.06l-1.77-1.77a.75.75 0 010-1.06zM3.76 3.76a.75.75 0 010 1.06L1.99 6.59a.75.75 0 01-1.06-1.06l1.77-1.77a.75.75 0 011.06 0zM10 7a3 3 0 100 6 3 3 0 000-6zM1.5 10a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5H2.25A.75.75 0 011.5 10zm15.5 0a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" />
                </svg>
              </span>{' '}
              smarter
            </span>
            <br />
            <span className="text-gray-400">
              and{' '}
              <span className="mx-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full align-middle" style={{ backgroundColor: '#D8FF5B' }}>
                <svg viewBox="0 0 20 20" fill="#111" className="h-4 w-4">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                </svg>
              </span>{' '}
              more adaptive
            </span>
          </h2>
        </div>

        {/* ---- BENTO GRID ---- */}
        <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-[auto_auto] md:gap-6">
          {/* LEFT â€” tall blue card (photo + overlay) */}
          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[24px] bg-sky-blue md:col-span-1 md:row-span-2" ref={(el) => { cardRefs.current[0] = el }} style={{ willChange: 'transform, opacity' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-blue to-sky-blue-light" />
            <div className="relative z-10 flex items-start justify-between p-5">
              <span className="text-sm font-bold uppercase tracking-widest text-white/60">
                Ipsum
              </span>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white/70 transition-colors hover:bg-white/30"
                aria-label="Chart"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7zm6-4a1 1 0 011-1h2a1 1 0 011 1v11a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-5a1 1 0 011-1h2a1 1 0 011 1v16a1 1 0 01-1 1h-2a1 1 0 01-1-1V2z" />
                </svg>
              </button>
            </div>

            {/* Photo */}
            <div className="relative z-10 mx-5 flex-1 overflow-hidden rounded-2xl">
              <Image src="/kid.jpg" alt="Team member" fill className="object-cover" />
            </div>

            {/* Bottom overlay */}
            <div className="relative z-20 flex flex-col gap-1 bg-gradient-to-t from-sky-blue/90 to-transparent px-5 pb-5 pt-12">
              <span
                className="text-5xl font-bold leading-none tracking-tight text-white drop-shadow-sm md:text-6xl"
                data-count="120"
                data-suffix="+"
              >
                120+
              </span>
              <span className="text-sm leading-snug text-white/80 md:text-base">
                Collaborating with leading AI and cloud technology providers.
              </span>
            </div>
          </div>

          {/* MIDDLE â€” white card (stat + chart + testimonial) */}
          <div className="flex flex-col gap-5 rounded-[24px] bg-white p-6 md:col-span-1 md:row-span-2 md:p-8" ref={(el) => { cardRefs.current[1] = el }} style={{ willChange: 'transform, opacity' }}>
            <span className="text-label uppercase tracking-widest text-gray-400">
              Commitment to measurable
            </span>

            <span
              className="text-6xl font-bold leading-none tracking-tight text-gray-900 md:text-7xl"
              data-count="100"
              data-suffix="%"
            >
              100%
            </span>

            {/* Mini bar chart */}
            <div data-chart className="flex h-24 items-end gap-2">
              {[85, 92, 78, 95, 88, 97, 91].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    ref={(el) => { barRefs.current[i] = el }}
                    className="w-full rounded-t bg-sky-blue"
                    data-height={`${h}%`}
                    style={{ height: 0 }}
                  />
                  <span className="text-[10px] text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {['/kid.jpg', '/resource/engeneer.jpg', '/GREEN.jpg', '/bluesky.jpg'].map((src, i) => (
                    <div key={i} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white">
                      <Image src={src} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-body italic leading-relaxed text-gray-500">
                &ldquo;Their automation strategy completely reshaped how we work. It&apos;s efficient, intelligent, and seamless.&rdquo;
              </p>
            </div>
          </div>

          {/* RIGHT-TOP â€” lime card */}
          <div
            className="flex flex-col gap-2 rounded-[24px] p-6 md:p-8"
            ref={(el) => { cardRefs.current[2] = el }}
            style={{ backgroundColor: '#D8FF5B', willChange: 'transform, opacity' }}
          >
            <span className="text-label uppercase tracking-widest text-gray-700/70">
              Data Points
            </span>
            <span
              className="text-5xl font-bold leading-none tracking-tight text-gray-900 md:text-6xl"
              data-count="520"
              data-suffix="k+"
            >
              520k+
            </span>
            <span className="text-sm leading-snug text-gray-700/80 md:text-base">
              Analyzed monthly to power smarter business strategies.
            </span>
          </div>

          {/* RIGHT-BOTTOM â€” black card */}
          <div className="flex items-center justify-between rounded-[24px] bg-[#111] p-6 md:p-8" ref={(el) => { cardRefs.current[3] = el }} style={{ willChange: 'transform, opacity' }}>
            <span className="text-label uppercase tracking-widest text-white/50">
              Continents
            </span>
            <span
              className="text-5xl font-bold leading-none tracking-tight text-white md:text-6xl"
              data-count="20"
              data-suffix="+"
            >
              20+
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}


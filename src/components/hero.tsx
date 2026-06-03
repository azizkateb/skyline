'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedButton } from './animated-button'
import { SeamlessVideo } from './seamless-video'
import { StarRating } from './star-rating'

gsap.registerPlugin(ScrollTrigger)

const cloudLayers = [
  { className: "-bottom-10 left-0 h-40 w-[500px] opacity-30", speed: 0.8 },
  { className: "-bottom-5 right-0 h-48 w-[600px] opacity-20", speed: 0.5 },
  { className: "bottom-16 left-1/3 h-32 w-[400px] opacity-25", speed: 1.2 },
]

const poppedIn = {
  opacity: 0,
  scale: 0.95,
  y: 40,
  transformPerspective: 1800,
  translateZ: -2400,
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const staggerRef = useRef<HTMLDivElement>(null)
  const cloudWrappers = useRef<(HTMLDivElement | null)[]>([])
  const cloudInnerRefs = useRef<(HTMLDivElement | null)[]>([])
  const starsRef = useRef<HTMLDivElement>(null)
  const titleScaleX = 1.25

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Pre-set initial hidden state BEFORE paint ──
    if (!reduced) {
      gsap.set(titleRef.current, { ...poppedIn, scaleX: titleScaleX * 0.85, scaleY: 0.85 })
      if (staggerRef.current) {
        gsap.set(staggerRef.current.children, { ...poppedIn })
      }
      gsap.set(starsRef.current, { opacity: 0, y: 20 })
    }

    let cancelled = false
    let ctx: gsap.Context | null = null

    const run = (introDelay = 0) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(titleRef.current, { opacity: 1, scaleX: titleScaleX, scaleY: 1, y: 0 })
          if (staggerRef.current) {
            gsap.set(staggerRef.current.children, { opacity: 1, scale: 1, y: 0 })
          }
          gsap.set(starsRef.current, { opacity: 1, y: 0 })
        } else {
          // ── Single coordinated timeline ──
          const tl = gsap.timeline({ delay: introDelay })

          tl.fromTo(titleRef.current, { ...poppedIn, scaleX: titleScaleX * 0.85, scaleY: 0.85 }, {
            opacity: 1, y: 0, scaleX: titleScaleX, scaleY: 1, z: 0,
            duration: 1, ease: 'back.out(1.6)',
          })

          if (staggerRef.current) {
            tl.fromTo(staggerRef.current.children, poppedIn, {
              opacity: 1, y: 0, scale: 1, z: 0,
              duration: 0.8, stagger: 0.12, ease: 'back.out(1.6)',
            }, '-=0.4')
          }

          if (starsRef.current) {
            tl.fromTo(starsRef.current, { opacity: 0, y: 20 }, {
              opacity: 1, y: 0,
              duration: 0.8, ease: 'back.out(1.6)',
            }, '-=0.4')
          }

          // Cloud drift (continuous, no scroll-trigger)
          cloudInnerRefs.current.forEach((el) => {
            if (!el) return
            gsap.to(el, {
              xPercent: gsap.utils.random(-25, 25, 1),
              duration: gsap.utils.random(40, 60, 1),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            })
          })
        }

        // ── Scroll-triggered cloud parallax ──
        const st = {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }

        cloudWrappers.current.forEach((el) => {
          if (!el) return
          gsap.to(el, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: { ...st },
          })
        })

      }, section)
    }

    const startWithNavOffset = () => {
      const startedAt = (window as any).__skylineNavIntroStartedAt as number | undefined
      const offset = 0.12
      const remaining = startedAt ? Math.max(0, offset - (performance.now() - startedAt) / 1000) : offset
      run(remaining)
    }

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        if (!cancelled) startWithNavOffset()
      })
    })

    return () => { cancelled = true; ctx?.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center overflow-hidden"
    >
      <SeamlessVideo src="/vedios/hero.mp4" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {cloudLayers.map((blob, i) => (
        <div
          key={i}
          ref={(el) => { cloudWrappers.current[i] = el }}
          className="pointer-events-none absolute will-change-transform"
        >
          <div
            ref={(el) => { cloudInnerRefs.current[i] = el }}
            className={`${blob.className} rounded-full bg-white/80 blur-3xl will-change-transform`}
            aria-hidden="true"
          />
        </div>
      ))}

      <div className="relative z-10 flex max-w-[760px] flex-col items-center px-6 text-center"
        style={{ paddingTop: 'clamp(7rem, 18vh, 12rem)', gap: 'clamp(4rem, 9vw, 7rem)' }}>
        <div
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
          style={{ paddingTop: 'clamp(4rem, 6vw, 6rem)' }}
        >
          <div
            className="h-40 w-72 opacity-70 sm:h-48 sm:w-96"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </div>
        <span
          className="uppercase tracking-[0.28em] text-white/90"
          style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
        >
          Platform
        </span>
        <h1
          ref={titleRef}
          className="hero-title leading-[1.04] tracking-[0.02em] text-white"
          style={{
            fontSize: 'clamp(3.5rem, 6.5vw, 12rem)',
            letterSpacing: '0.08em',
            transform: 'scaleX(1.3)',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
          }}
        >
          Skyline
        </h1>
        <div ref={staggerRef} className="flex flex-col items-center gap-[5rem]">
          <p
            className="max-w-3xl text-white/80 drop-shadow-sm"
            style={{ fontSize: 'clamp(1.1375rem, 3.64vw, 1.4105rem)', lineHeight: 1.18, fontWeight: 500, textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
          >
            A modern foundation for ambitious products. Clean, fast, and designed to scale.
          </p>
          <div className="flex items-center gap-4" style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.55))' }}>
            <AnimatedButton label="Get Started Free" size="lg" />
            <a
              href="#"
              className="rounded-full border border-white/40 px-11 py-5 text-button font-medium text-white/90 transition-all hover:border-white/70 hover:bg-white/10 hover:text-white drop-shadow-sm" style={{ fontSize: '16.1px' }}
            >
              View Demo
            </a>
          </div>
        </div>
      </div>

      <div className="h-20 md:h-24" />

      <div ref={starsRef} className="z-10 mt-0 mb-14 flex flex-col items-center gap-1.5">
        <StarRating />
        <span className="text-xl text-white/80">Rated 4.9/5 by 4,900+ clients</span>
      </div>

    </section>
  )
}

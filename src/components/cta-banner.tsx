'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedButton } from './animated-button'

gsap.registerPlugin(ScrollTrigger)

const avatars = [
  { bg: '#6366f1', label: 'A' },
  { bg: '#8b5cf6', label: 'B' },
  { bg: '#ec4899', label: 'C' },
]

export function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const content = contentRef.current
      const items = itemRefs.current.filter(Boolean)

      if (reduced) {
        gsap.set(card, { opacity: 1, scale: 1, z: 0, rotateX: 0 })
        gsap.set(content, { opacity: 1, y: 0 })
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      gsap.set(card, {
        opacity: 0,
        scale: 0.18,
        z: -3000,
        rotateX: 22,
        transformPerspective: 1800,
        transformOrigin: '50% 50%',
        force3D: true,
      })
      gsap.set(content, { opacity: 0, x: -120 })
      gsap.set(items, { opacity: 0, x: -60, force3D: true })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          once: true,
        },
      })

      tl.to(card, {
        opacity: 1,
        scale: 1,
        z: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'back.out(1.8)',
      })
        .to(content, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.2)
        .to(items, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
        }, 0.4)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative mx-4 overflow-hidden rounded-[28px] bg-sky-blue md:mx-6 lg:mx-8"
    >
      <div
        ref={cardRef}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
      >
        <div className="absolute inset-0" style={{ willChange: 'opacity' }}>
          <div
            className="absolute inset-0"
            style={{ willChange: 'transform' }}
          >
            <Image
              src="/GREEN.jpg"
              alt=""
              fill
              priority
              quality={70}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.35), transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 py-16 md:py-[7.5rem]">
        <div className="pl-6 md:pl-10 lg:pl-12">
          <div
            ref={contentRef}
            className="flex flex-col items-start gap-6 md:gap-8"
            style={{
              maxWidth: 620,
              willChange: 'transform, opacity',
            }}
          >
            <div ref={(el) => { itemRefs.current[0] = el }}>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-white drop-shadow-md">
                  Trusted over 5,000+
                </span>
                <div className="flex -space-x-3" role="presentation">
                  {avatars.map((a, i) => (
                    <div
                      key={i}
                      className="flex size-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                      style={{ backgroundColor: a.bg }}
                      aria-hidden="true"
                    >
                      {a.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div ref={(el) => { itemRefs.current[1] = el }}>
              <h2
                className="font-bold leading-tight text-white"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                We combine human insight with artificial intelligence
              </h2>
            </div>

            <div ref={(el) => { itemRefs.current[2] = el }}>
              <p
                className="text-base text-white/85 md:text-lg"
                style={{
                  maxWidth: '52ch',
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}
              >
                Our consulting team bridges strategic thinking and advanced AI
                technologies to help companies streamline processes, improve
                decision-making, and create intelligent digital experiences.
              </p>
            </div>

            <div ref={(el) => { itemRefs.current[3] = el }} className="w-full sm:w-auto">
              <AnimatedButton label="Get Started" href="/contact" size="lg" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

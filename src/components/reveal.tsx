'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  depth?: number
  scaleFrom?: number
  duration?: number
  start?: string
  pop?: boolean
  delay?: number
  immediate?: boolean
  className?: string
}

export function Reveal({
  children,
  depth = 700,
  scaleFrom = 0.2,
  duration = 0.55,
  start = 'top 90%',
  pop = false,
  delay = 0,
  immediate = false,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set(el, { opacity: 1, z: 0, scale: 1 })
      return
    }

    const mm = gsap.matchMedia()

    const safetyTimer = setTimeout(() => {
      gsap.set(el, { opacity: 1, z: 0, scale: 1 })
    }, 5000)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    mm.add('(max-width: 767px)', () => {
      const mobileDepth = depth * 0.35
      const mobileScale = Math.max(scaleFrom, 0.7)
      const mobileDuration = Math.min(duration * 0.7, 0.5)

      gsap.fromTo(
        el,
        { z: -mobileDepth, scale: mobileScale, opacity: 0, transformPerspective: 1000 },
        {
          z: 0, scale: 1, opacity: 1,
          duration: mobileDuration,
          delay,
          ease: 'power2.out',
          ...(immediate ? {} : { scrollTrigger: { trigger: el, start, once: true } }),
          onComplete: () => clearTimeout(safetyTimer),
        }
      )
      return () => clearTimeout(safetyTimer)
    })

    mm.add('(min-width: 768px)', () => {
      gsap.fromTo(
        el,
        { z: -depth, scale: scaleFrom, opacity: 0, transformPerspective: 1000 },
        {
          z: 0, scale: 1, opacity: 1, duration, delay,
          ease: pop ? 'back.out(1.5)' : 'power3.out',
          ...(immediate ? {} : { scrollTrigger: { trigger: el, start, once: true } }),
          onComplete: () => clearTimeout(safetyTimer),
        }
      )
      return () => clearTimeout(safetyTimer)
    })

    return () => {
      clearTimeout(safetyTimer)
      window.removeEventListener('resize', onResize)
      mm.revert()
    }
  }, [depth, scaleFrom, duration, start, pop, delay, immediate])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  )
}

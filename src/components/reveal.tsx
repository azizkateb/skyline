'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  duration?: number
  start?: string
  delay?: number
  className?: string
}

export function Reveal({
  children,
  duration = 1.0,
  start = 'top 88%',
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set(el, { opacity: 1, scale: 1, y: 0 })
      return
    }

    // Pre-set initial hidden state BEFORE paint (pop effect with Y offset)
    gsap.set(el, { opacity: 0, scale: 0.95, y: 40 })

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration,
        delay,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [duration, start, delay])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  )
}

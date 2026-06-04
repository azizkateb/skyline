'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  from?: gsap.TweenVars
  stagger?: number
  start?: string
  once?: boolean
  scrub?: boolean | number
  duration?: number
  ease?: string
}

export function useReveal(
  ref: React.RefObject<HTMLElement | null>,
  options: RevealOptions = {}
) {
  const {
    from: fromVars = {
      opacity: 0,
      scale: 0.85,
      y: 40,
      transformPerspective: 1000,
      translateZ: -120,
    },
    stagger,
    start = 'top 85%',
    once = true,
    scrub,
    duration = 1.2,
    ease = 'power3.out',
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(el, { opacity: 1, scale: 1, y: 0, x: 0, translateZ: 0 })
      gsap.set(el.children, { opacity: 1, scale: 1, y: 0, x: 0, translateZ: 0 })
      return
    }

    const ctx = gsap.context(() => {
      if (stagger && el.children.length) {
        gsap.from(el.children, {
          ...fromVars,
          stagger,
          scrollTrigger: { trigger: el, start, once },
          ease,
          duration,
        })
      } else if (scrub) {
        gsap.fromTo(el,
          { ...fromVars },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            translateZ: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: typeof scrub === 'number' ? scrub : 1,
            },
          }
        )
      } else {
        gsap.from(el, {
          ...fromVars,
          scrollTrigger: { trigger: el, start, once },
          ease,
          duration,
        })
      }
    }, el)

    return () => ctx.revert()
  }, [ref, stagger, start, once, scrub, duration, ease])
}

'use client'

import { useEffect, useLayoutEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisSmoothScroll({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const previous = window.history.scrollRestoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo(0, 0)

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = previous
      }
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0,
      infinite: false,
    })

    let destroyed = false

    const syncScrollState = () => {
      if (destroyed) return

      const shouldResetToTop = window.scrollY <= 4
      ScrollTrigger.refresh()

      if (shouldResetToTop) {
        lenis.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      }
    }

    const readyForRefresh =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener('load', () => resolve(), { once: true })
          })

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    Promise.all([document.fonts.ready, readyForRefresh]).then(() => {
      requestAnimationFrame(() => {
        syncScrollState()
      })
    })

    return () => {
      destroyed = true
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

'use client'

import { useState, useRef, useEffect } from 'react'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function AnimatedCounter({ target, suffix = '', duration = 2, className = '', style }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || counted.current) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || counted.current) return
        counted.current = true
        observer.unobserve(el)

        const start = performance.now()

        const tick = (now: number) => {
          const elapsed = (now - start) / 1000
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * target))

          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {count}{suffix}
    </span>
  )
}

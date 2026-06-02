'use client'

import { useEffect, useRef } from 'react'

export function SlowScroll({ children }: { children: React.ReactNode }) {
  const ticking = useRef(false)

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1) return
      e.preventDefault()
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        window.scrollBy(0, e.deltaY * 0.85)
        ticking.current = false
      })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  return <>{children}</>
}

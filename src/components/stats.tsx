'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container } from "./container"
import { Section } from "./section"
import { Grid } from "./grid"

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: "2.4B", label: "Total Volume", target: 2.4 },
  { value: "12,847", label: "Markets Created", target: 12847 },
  { value: "89.2%", label: "Accuracy Rate", target: 89.2 },
  { value: "50K+", label: "Active Traders", target: 50000 },
]

function getFormatter(original: string) {
  if (original.endsWith("B")) return (v: number) => `${v.toFixed(1)}B`
  if (original.endsWith("%")) return (v: number) => `${v.toFixed(1)}%`
  if (original.endsWith("K+")) return (v: number) => `${Math.round(v / 1000)}K+`
  return (v: number) => Math.round(v).toLocaleString()
}

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const spans = sectionRef.current?.querySelectorAll<HTMLSpanElement>('[data-target]')
      if (!spans) return

      spans.forEach((span) => {
        const target = parseFloat(span.dataset.target!)
        const format = getFormatter(span.textContent || "")
        const obj = { val: 0 }

        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => { span.textContent = format(obj.val) },
          scrollTrigger: {
            trigger: span,
            start: 'top 80%',
            once: true,
          },
        })
      })
    }, sectionRef.current!)

    return () => ctx.revert()
  }, [])

  return (
    <Section spacing={120} className="bg-gray-100">
      <Container>
        <div ref={sectionRef}>
          <Grid>
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 py-8">
                <span
                  className="text-hero font-semibold tracking-tight text-gray-900"
                  style={{ fontSize: 'clamp(2rem, 2.8vw, 2.5rem)' }}
                  data-target={stat.target}
                >
                  {stat.value}
                </span>
                <span className="text-subtitle text-gray-500" style={{ fontSize: 'clamp(0.625rem, 0.825vw, 0.775rem)' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </Section>
  )
}

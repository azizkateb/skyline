'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Container } from './container'
import { Section } from './section'

const testimonials = [
  {
    quote: "We replaced three separate tools with Skyline. Our analysts went from wrestling with data to actually using it.",
    name: "Sarah Chen",
    role: "Head of Trading, Meridian Capital",
    image: "/testimonials/Sarah.jpg",
  },
  {
    quote: "The API-first design meant we had a prototype integrated in two days. Everything just works the way you'd expect.",
    name: "Marcus Johnson",
    role: "CTO, AlgoStreet",
    image: "/testimonials/marcus.webp",
  },
  {
    quote: "Real-time risk analytics at this fidelity usually requires a dedicated engineering team. Skyline gives it to us out of the box.",
    name: "Elena Vogt",
    role: "Risk Director, Pacific Holdings",
    image: "/testimonials/elena.webp",
  },
  {
    quote: "The platform's reliability has been exceptional. 99.99% uptime since we onboarded six months ago.",
    name: "David Park",
    role: "VP Engineering, QuantWorks",
    image: "/testimonials/DAVID.webp",
  },
  {
    quote: "We've reduced our time-to-market for new trading strategies by 60%. Skyline's infrastructure is unmatched.",
    name: "Aisha Patel",
    role: "Head of Strategy, Nova Markets",
    image: "/testimonials/Aisha.jpeg",
  },
]

const doubled = [...testimonials, ...testimonials]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      controls.start({ opacity: 1, x: 0 })
      return
    }
    const el = sectionRef.current
    if (!el) return
    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      controls.start((i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
      }))
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    const fallback = setTimeout(reveal, 3000)
    return () => { observer.disconnect(); clearTimeout(fallback) }
  }, [controls])

  return (
    <Section ref={sectionRef} spacing={120} className="bg-gray-100">
      <Container>
        <div className="flex flex-col gap-2">
          <span
            className="text-label uppercase tracking-widest text-gray-500"
            style={{ fontSize: 'clamp(0.475rem, 0.575vw, 0.525rem)' }}
          >
            Testimonials
          </span>
          <h2 className="text-section" style={{ fontSize: 'clamp(2.1rem, 3.2vw, 2.8rem)', fontWeight: 520 }}>
            Trusted by teams that move fast
          </h2>
          <p className="text-subtitle mt-2 max-w-2xl text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.975rem)' }}>
            See what our users have to say about Skyline.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden">
          <div
            className="marquee-track flex gap-6"
            style={{ width: 'max-content' }}
          >
            {doubled.map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                custom={i}
                initial={{ opacity: 0, x: 80 }}
                animate={controls}
                className="min-w-[340px] max-w-[400px] flex-none rounded-3xl border border-gray-200 bg-white p-8"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <p className="text-body leading-relaxed text-gray-600">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={t.image!} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-nav font-semibold text-gray-900">{t.name}</div>
                    <div className="text-label text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        .marquee-track {
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </Section>
  )
}

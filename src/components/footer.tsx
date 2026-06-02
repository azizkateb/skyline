'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container } from './container'

gsap.registerPlugin(ScrollTrigger)

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Docs', 'API Reference', 'Guides', 'Status'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Security'],
}

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const inner = innerRef.current
    if (!section || !inner) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(inner, { opacity: 1, scale: 1, z: 0, rotateX: 0 })
        return
      }

      gsap.set(inner, {
        opacity: 0,
        scale: 0.15,
        z: -3000,
        rotateX: 24,
        transformPerspective: 1800,
        transformOrigin: '50% 50%',
        force3D: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          once: true,
        },
      })

      tl.to(inner, {
        opacity: 1,
        scale: 1,
        z: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'back.out(1.8)',
      })
        .to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
        }, 0.15)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={sectionRef} className="border-t border-gray-200 bg-white">
      <div
        ref={innerRef}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
      >
        <Container>
          <div
            ref={contentRef}
            className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4"
            style={{ willChange: 'transform, opacity' }}
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-4">
                <span className="text-lg font-semibold text-gray-900 md:text-xl">{category}</span>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-base text-gray-500 transition-colors hover:text-gray-900 md:text-lg">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 border-t border-gray-100 py-8 md:flex-row md:justify-between">
            <span className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">Skyline</span>
            <p className="text-sm text-gray-400 md:text-base">&copy; {new Date().getFullYear()} Skyline. All rights reserved.</p>
          </div>
        </Container>
      </div>
    </footer>
  )
}

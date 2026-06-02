'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Container } from './container'
import { AnimatedButton } from './animated-button'

interface SubLink {
  label: string
  href: string
  description?: string
}

interface NavItem {
  label: string
  href?: string
  subLinks?: SubLink[]
}

function MobileNavLink({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false)

  if (!item.subLinks) {
    return (
      <a
        href={item.href!}
        onClick={onClose}
        className="block py-3 font-medium text-white/90 transition-colors hover:text-white" style={{ fontSize: '0.9rem' }}
      >
        {item.label}
      </a>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 py-3 font-medium text-white/90 transition-colors hover:text-white" style={{ fontSize: '0.9rem' }}
      >
        {item.label}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-4 flex flex-col gap-1 pb-3">
              {item.subLinks.map((sub) => (
                <a
                  key={sub.label}
                  href={sub.href}
                  onClick={onClose}
                  className="block py-2 text-white/70 transition-colors hover:text-white" style={{ fontSize: '0.675rem' }}
                >
                  {sub.label}
                  {sub.description && (
                    <span className="block text-white/40" style={{ fontSize: '0.525rem' }}>{sub.description}</span>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavDropdown({ item, isLast, scrolled }: { item: NavItem; isLast: boolean; scrolled: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const el = ref.current
    if (!el) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, close])

  if (!item.subLinks) {
    return (
      <a
        href={item.href!}
        className={`transition-opacity ${scrolled ? 'text-white/80 hover:text-white' : 'text-white/90 hover:text-white'}`} style={{ fontSize: '1.14rem', fontWeight: 500 }}
      >
        {item.label}
      </a>
    )
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!ref.current?.contains(e.relatedTarget)) close()
        }}
        className={`flex items-center gap-1.5 transition-opacity ${scrolled ? 'text-white/80 hover:text-white' : 'text-white/90 hover:text-white'}`} style={{ fontSize: '1.14rem', fontWeight: 500 }}
      >
        {item.label}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute top-full pt-2 ${isLast ? 'right-0' : 'left-0'}`}
          >
            <div className="flex min-w-[260px] flex-col gap-1 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
              {item.subLinks.map((sub, idx) => (
                <motion.a
                  key={sub.label}
                  href={sub.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.2 }}
                  className="group rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                  tabIndex={0}
                >
                  <div className="text-gray-900 group-hover:text-gray-700" style={{ fontSize: '0.675rem', fontWeight: 500 }}>
                    {sub.label}
                  </div>
                  {sub.description && (
                    <div className="text-gray-400" style={{ fontSize: '0.57rem' }}>{sub.description}</div>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const enteredRef = useRef(false)
  const announceIntroStart = () => {
    ;(window as any).__skylineNavIntroStartedAt = performance.now()
    window.dispatchEvent(new CustomEvent('skyline:nav-intro-start'))
  }
  const announceIntroDone = () => {
    window.dispatchEvent(new CustomEvent('skyline:nav-intro-done'))
  }

  const navLinks: NavItem[] = [
    {
      label: 'Features',
      subLinks: [
        { label: 'Real-time Data', href: '#', description: 'Live market feeds with sub-second latency' },
        { label: 'Smart Alerts', href: '#', description: 'Multi-condition trigger notifications' },
        { label: 'Risk Analytics', href: '#', description: 'Portfolio-level VaR and stress testing' },
      ],
    },
    { label: 'Pricing', href: '#' },
    {
      label: 'More',
      subLinks: [
        { label: 'Docs', href: '#', description: 'Guides, references, and tutorials' },
        { label: 'Blog', href: '#', description: 'Product updates and insights' },
        { label: 'API Reference', href: '#', description: 'REST and WebSocket API docs' },
        { label: 'Changelog', href: '#', description: 'Latest releases and improvements' },
      ],
    },
    { label: 'Blog', href: '#' },
  ]

  useEffect(() => {
    const el = headerRef.current
    const offset = el ? el.getBoundingClientRect().top : 16
    const height = el ? el.getBoundingClientRect().height : 64
    const threshold = offset + height
    const hysteresis = threshold * 0.5

    const onScroll = () => {
      const y = window.scrollY
      if (y > threshold) setScrolled(true)
      else if (y < hysteresis) setScrolled(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el || enteredRef.current) return
    enteredRef.current = true

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.set(el, { z: -1400, scale: 0.85, opacity: 0, transformPerspective: 1000 })

    if (reduced) {
      announceIntroStart()
      gsap.set(el, { opacity: 1, z: 0, scale: 1 })
      announceIntroDone()
      return
    }

    let ctx: gsap.Context | null = null
    let cancelled = false

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        if (cancelled) return
        ctx = gsap.context(() => {
          announceIntroStart()
          gsap.to(el, {
            z: 0,
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            onComplete: announceIntroDone,
          })
        }, el)
      })
    })

    return () => { cancelled = true; ctx?.revert() }
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <header
      ref={headerRef}
      className="absolute inset-x-0 top-4 md:top-8 z-50"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'transparent' }}
      />
      <div className="relative z-10">
        <Container>
          <div className="flex h-16 items-center">
            <span className={`flex-1 tracking-tight transition-colors ${scrolled ? 'text-white/90' : 'text-white'}`} style={{ fontSize: '1.56rem', fontWeight: 500 }}>
              Skyline
            </span>

            <nav aria-label="Main navigation" className="flex-1 hidden items-center justify-center gap-10 md:flex">
              {navLinks.map((item, i) => (
                <NavDropdown key={item.label} item={item} isLast={i === navLinks.length - 1} scrolled={scrolled} />
              ))}
            </nav>

            <div className="flex-1 flex items-center justify-end gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex md:hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div className="hidden md:block">
                <AnimatedButton label="Get Started" size="md" className="!font-medium" style={{ fontSize: '10.2px' }} />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 end-0 z-50 flex h-full w-[300px] flex-col bg-gray-900 p-6 pt-24 shadow-xl md:hidden"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((item) => (
                  <MobileNavLink key={item.label} item={item} onClose={closeMobile} />
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4 pt-8">
                <AnimatedButton label="Get Started" size="md" className="!font-medium w-full" style={{ fontSize: '10.2px' }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

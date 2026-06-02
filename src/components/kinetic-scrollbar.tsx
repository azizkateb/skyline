'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  decay: number
  type: 'fire' | 'ember' | 'smoke'
  hue: number
  life: number
  maxLife: number
}

interface AudioEngine {
  ctx: AudioContext | null
  crackBuffer: AudioBuffer | null
  filterNode: BiquadFilterNode | null
  oscNode: OscillatorNode | null
  gainNode: GainNode | null
}

export function KineticScrollbar({
  children,
  theme = 'light',
}: {
  children: React.ReactNode
  theme?: 'light' | 'dark'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const velocityRef = useRef(0)
  const rawVelocityRef = useRef(0)
  const lastScrollRef = useRef({ y: 0, time: 0 })
  const animFrameRef = useRef(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // ── Audio Engine ──────────────────────────────────────────
  const audioRef = useRef<AudioEngine>({
    ctx: null,
    crackBuffer: null,
    filterNode: null,
    oscNode: null,
    gainNode: null,
  })
  const audioInitRef = useRef(false)

  const initAudio = useCallback(() => {
    if (audioInitRef.current) return
    audioInitRef.current = true

    try {
      const ctx = new AudioContext()

      const bufferSize = ctx.sampleRate * 0.05
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15))
      }

      const filterNode = ctx.createBiquadFilter()
      filterNode.type = 'highpass'
      filterNode.frequency.value = 2000

      const gainNode = ctx.createGain()
      gainNode.gain.value = 0

      const oscNode = ctx.createOscillator()
      oscNode.type = 'sawtooth'
      oscNode.frequency.value = 80

      const oscGain = ctx.createGain()
      oscGain.gain.value = 0

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = 100
      bandpass.Q.value = 2

      oscNode.connect(oscGain)
      oscGain.connect(bandpass)
      bandpass.connect(ctx.destination)
      oscNode.start()

      Object.assign(audioRef.current, {
        ctx,
        crackBuffer: buffer,
        filterNode,
        gainNode: oscGain,
        oscNode,
      })
    } catch {
      /* audio not available */
    }
  }, [])

  const playCrack = useCallback(() => {
    const { ctx, crackBuffer, filterNode, gainNode } = audioRef.current
    if (!ctx || !crackBuffer || !filterNode || !gainNode) return

    const src = ctx.createBufferSource()
    src.buffer = crackBuffer
    src.connect(filterNode)
    gainNode.gain.value = 0.06 + Math.random() * 0.04

    const crackGain = ctx.createGain()
    filterNode.connect(crackGain)
    crackGain.connect(ctx.destination)
    crackGain.gain.setValueAtTime(0.08, ctx.currentTime)
    crackGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    src.start(ctx.currentTime)
    src.stop(ctx.currentTime + 0.06)
  }, [])

  const updateRoar = useCallback((speed: number) => {
    const { ctx, gainNode, oscNode } = audioRef.current
    if (!ctx || !gainNode || !oscNode) return

    const normalized = Math.min(speed / 30, 1)
    gainNode.gain.setTargetAtTime(normalized * 0.03, ctx.currentTime, 0.1)
    oscNode.frequency.setTargetAtTime(60 + normalized * 60, ctx.currentTime, 0.15)
  }, [])

  // ── Scroll Tracking ───────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      const now = performance.now()
      const dy = el.scrollTop - lastScrollRef.current.y
      const dt = now - lastScrollRef.current.time
      if (dt > 0) {
        rawVelocityRef.current = (dy / dt) * 16.67
        velocityRef.current = velocityRef.current * 0.4 + rawVelocityRef.current * 0.6
      }
      lastScrollRef.current = { y: el.scrollTop, time: now }
      setScrollTop(el.scrollTop)
      setScrollHeight(el.scrollHeight)
      setClientHeight(el.clientHeight)
    }

    const ro = new ResizeObserver(() => {
      setScrollHeight(el.scrollHeight)
      setClientHeight(el.clientHeight)
    })

    el.addEventListener('scroll', onScroll, { passive: true })
    ro.observe(el)
    onScroll()

    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  // ── Drag Thumb ────────────────────────────────────────────
  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const container = containerRef.current
    const onMove = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const ratio = container.scrollHeight / container.clientHeight
      const y = e.clientY - rect.top
      container.scrollTop = (y / rect.height) * container.scrollHeight
    }

    const onUp = () => setIsDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging])

  // ── Canvas Particle System ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = 80
      const h = container.clientHeight
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    resize()

    const ro = new ResizeObserver(() => resize())
    ro.observe(container)

    const spawnParticle = (speed: number) => {
      if (Math.random() > Math.min(speed / 8, 0.4)) return
      const thumbTop = (scrollTop / scrollHeight) * container.clientHeight || 0
      const thumbHeight = Math.max((container.clientHeight / scrollHeight) * container.clientHeight, 30)
      const thumbCenter = thumbTop + thumbHeight / 2

      const type: 'fire' | 'ember' | 'smoke' =
        Math.random() < 0.5 ? 'fire' : Math.random() < 0.6 ? 'ember' : 'smoke'

      const base: Particle = {
        x: 40 + (Math.random() - 0.5) * 30,
        y: thumbCenter + (Math.random() - 0.5) * thumbHeight * 0.6,
        vx: 0,
        vy: 0,
        radius: 0,
        alpha: 1,
        decay: 0,
        type,
        hue: 0,
        life: 0,
        maxLife: 0,
      }

      if (type === 'fire') {
        base.radius = 12 + Math.random() * 20
        base.vx = -(1 + Math.random() * 2)
        base.vy = -(0.5 + Math.random() * 1.5)
        base.hue = 20 + Math.random() * 20
        base.decay = 0.008 + Math.random() * 0.012
        base.maxLife = 80 + Math.random() * 60
      } else if (type === 'ember') {
        base.radius = 1.5 + Math.random() * 2.5
        base.vx = -(3 + Math.random() * 4)
        base.vy = -(2 + Math.random() * 3)
        base.hue = 45 + Math.random() * 15
        base.decay = 0.02 + Math.random() * 0.03
        base.maxLife = 20 + Math.random() * 30
      } else {
        base.radius = 25 + Math.random() * 35
        base.vx = -(0.3 + Math.random() * 0.5)
        base.vy = -(0.2 + Math.random() * 0.4)
        base.decay = 0.004 + Math.random() * 0.006
        base.maxLife = 120 + Math.random() * 80
      }

      particlesRef.current.push(base)
    }

    let crackTimer = 0
    const isLight = theme === 'light'

    const loop = () => {
      const vel = Math.abs(velocityRef.current)
      const decayed = vel * 0.97
      velocityRef.current *= 0.97

      if (vel > 0.5) {
        spawnParticle(vel)
        crackTimer++
        if (crackTimer > 10 + Math.random() * 20) {
          crackTimer = 0
          playCrack()
        }
        updateRoar(vel)
      }

      ctx.clearRect(0, 0, 80, container.clientHeight)

      ctx.globalCompositeOperation = isLight ? 'source-over' : 'screen'

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.life++

        if (p.life > p.maxLife || p.alpha <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        p.x += p.vx + Math.sin(p.life * 0.03) * 0.3
        p.y += p.vy
        p.alpha -= p.decay
        p.alpha = Math.max(p.alpha, 0)

        if (p.type === 'fire') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
          const alpha = p.alpha * 0.4
          if (isLight) {
            grad.addColorStop(0, `rgba(255, 120, 20, ${alpha})`)
            grad.addColorStop(0.4, `rgba(225, 65, 0, ${alpha * 0.6})`)
            grad.addColorStop(1, `rgba(180, 40, 0, 0)`)
          } else {
            grad.addColorStop(0, `rgba(255, 234, 0, ${alpha})`)
            grad.addColorStop(0.3, `rgba(255, 77, 0, ${alpha * 0.7})`)
            grad.addColorStop(0.7, `rgba(145, 0, 0, ${alpha * 0.3})`)
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
          }
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'ember') {
          const alpha = p.alpha * 0.9
          ctx.fillStyle = isLight
            ? `rgba(255, 180, 50, ${alpha})`
            : `rgba(255, 234, 0, ${alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
          const alpha = p.alpha * 0.12
          grad.addColorStop(0, `rgba(160, 165, 175, ${alpha})`)
          grad.addColorStop(1, `rgba(110, 115, 125, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-150)
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      ro.disconnect()
    }
  }, [theme, scrollTop, scrollHeight, playCrack, updateRoar])

  const thumbHeight = clientHeight && scrollHeight
    ? Math.max((clientHeight / scrollHeight) * clientHeight, 30)
    : 30

  const thumbTop = scrollHeight && clientHeight
    ? (scrollTop / scrollHeight) * clientHeight
    : 0

  return (
    <div
      className="relative flex-1 flex overflow-hidden"
      onClick={() => initAudio()}
    >
      <div
        ref={containerRef}
        className="flex-1 h-full overflow-y-auto hide-scrollbar select-text"
      >
        {children}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute top-0 right-0 h-full pointer-events-none z-40"
      />

      <div
        className={`absolute top-0 right-0 h-full w-6 z-50 flex justify-center ${
          theme === 'light'
            ? 'border-l border-zinc-200/40 bg-transparent'
            : 'border-l border-zinc-800/40 bg-transparent'
        }`}
      >
        <div
          ref={thumbRef}
          onMouseDown={handleThumbMouseDown}
          className="absolute left-1/2 -translate-x-1/2 rounded-full cursor-grab active:cursor-grabbing transition-opacity duration-200"
          style={{
            top: thumbTop,
            height: thumbHeight,
            width: 14,
            background:
              theme === 'light'
                ? 'linear-gradient(to bottom, #ffc800, #ff4d00)'
                : 'linear-gradient(to bottom, #ffea00, #ff4c00, #910000)',
            boxShadow:
              theme === 'light'
                ? '0 2px 10px rgba(255, 77, 0, 0.45)'
                : '0 0 18px rgba(255, 77, 0, 0.6)',
            opacity: isDragging ? 1 : 0.85,
          }}
        />
      </div>
    </div>
  )
}

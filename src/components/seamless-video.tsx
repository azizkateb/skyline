'use client'

import { useEffect, useRef } from 'react'

interface SeamlessVideoProps {
  src: string
}

export function SeamlessVideo({ src }: SeamlessVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let cancelled = false

    const video = document.createElement('video')
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'
    video.disablePictureInPicture = true
    video.disableRemotePlayback = true
    video.setAttribute('playsinline', '')
    video.setAttribute('aria-hidden', 'true')

    const source = document.createElement('source')
    source.src = src
    source.type = 'video/mp4'
    video.appendChild(source)
    video.load()

    const resize = () => {
      const parent = canvas?.parentElement
      if (!canvas || !parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const render = () => {
      if (cancelled || !canvas || !ctx) return
      if (video.readyState >= 2) {
        const vw = video.videoWidth
        const vh = video.videoHeight
        const cw = canvas.width
        const ch = canvas.height
        const scale = Math.max(cw / vw, ch / vh)
        const sw = vw * scale
        const sh = vh * scale
        ctx.clearRect(0, 0, cw, ch)
        ctx.drawImage(video, (cw - sw) / 2, (ch - sh) / 2, sw, sh)
      }
      rafId = requestAnimationFrame(render)
    }

    video.play().catch(() => {})
    rafId = requestAnimationFrame(render)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      video.pause()
      window.removeEventListener('resize', resize)
    }
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}

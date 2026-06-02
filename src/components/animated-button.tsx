'use client'

import { forwardRef } from 'react'

interface AnimatedButtonProps {
  label?: string
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

const sizeMap = {
  sm: { padding: '11px 26px', fontSize: '10.5px' },
  md: { padding: '17px 38px', fontSize: '11.9px' },
  lg: { padding: '24px 58px', fontSize: '16.1px' },
} as const

const c = '#D8FF5B'
const d = '#111111'

const stylesId = 'abtn-s'

const css = `
.${stylesId} {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 4px solid transparent;
  font-weight: 500;
  color: ${c};
  box-shadow: 0 0 0 2px ${c};
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  outline: none;
  text-decoration: none;
  font-family: inherit;
  background: transparent;
  border-radius: 100px;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}
.${stylesId} svg {
  position: absolute;
  width: 24px;
  fill: ${c};
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.${stylesId} .a1 {
  right: 16px;
}
.${stylesId} .a2 {
  left: -25%;
}
.${stylesId} .cir {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: ${c};
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.${stylesId} .txt {
  position: relative;
  z-index: 1;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.${stylesId}:hover {
  box-shadow: 0 0 0 12px transparent;
  color: ${d};
  border-radius: 12px;
}
.${stylesId}:hover .a1 { right: -25%; }
.${stylesId}:hover .a2 { left: 16px; }
.${stylesId}:hover .txt { transform: translateX(12px); }
.${stylesId}:hover svg { fill: ${d}; }
.${stylesId}:hover .cir { width: 220px; height: 220px; opacity: 1; }
.${stylesId}:active { scale: 0.95; box-shadow: 0 0 0 4px ${c}; }
.${stylesId}:focus-visible {
  outline: 2px solid ${c};
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .${stylesId},
  .${stylesId} *,
  .${stylesId} *::before,
  .${stylesId} *::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
  }
  .${stylesId}:hover { border-radius: 12px; }
  .${stylesId}:hover .a1,
  .${stylesId}:hover .a2,
  .${stylesId}:hover .txt,
  .${stylesId}:hover .cir {
    transform: none;
    left: auto;
    right: auto;
    opacity: 0;
  }
}
`

export const AnimatedButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AnimatedButtonProps>(
  ({ label = 'Get Started', href, onClick, size = 'md', className = '', style }, ref) => {
    const s = { ...sizeMap[size], ...style }
    const cls = `${stylesId} ${className}`

    const inner = (
      <>
        <svg viewBox="0 0 24 24" className="a2" aria-hidden="true">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="txt">{label}</span>
        <span className="cir" />
        <svg viewBox="0 0 24 24" className="a1" aria-hidden="true">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <style>{css}</style>
      </>
    )

    if (href) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} aria-label={label} style={s}>
          {inner}
        </a>
      )
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} onClick={onClick} className={cls} aria-label={label} type="button" style={s}>
        {inner}
      </button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

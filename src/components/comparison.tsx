'use client'

import { Reveal } from './reveal'
import { Container } from './container'
import { Section } from './section'

const traditional = [
  "Manual data entry across disconnected spreadsheets",
  "Hourly polling with 5–15 minute latency windows",
  "Static PDF reports with no interactive drill-down",
  "Separate logins for charting, execution, and risk",
  "Email-based alerting with no conditional logic",
]

const platform = [
  "Unified real-time feed with sub-second updates",
  "WebSocket streaming with automatic reconnection",
  "Live dashboards with custom views and exports",
  "Single workspace for analysis, trading, and risk",
  "Multi-condition alerts via SMS, email, and webhooks",
]

export function Comparison() {
  return (
    <Section spacing={120} className="bg-white">
      <Container>
        <div className="flex flex-col gap-2">
          <Reveal>
            <span className="uppercase tracking-widest text-gray-500" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>Why Switch</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section" style={{ fontSize: 'clamp(1.75rem, 2.75vw, 2.5rem)', fontWeight: 620 }}>Old way vs. the right way</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-2 max-w-2xl text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 1rem)', fontWeight: 450, lineHeight: 1.5 }}>Most trading tools were built before modern web standards existed. Skyline changes that.</p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-8">
              <h3 className="text-gray-500" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 600, lineHeight: 1.25 }}>Traditional Method</h3>
              <ul className="flex flex-col gap-4">
                {traditional.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-500" style={{ fontSize: 'clamp(1.125rem, 1.4vw, 1.35rem)', fontWeight: 400, lineHeight: 1.6 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" aria-hidden="true">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="flex flex-col gap-6 rounded-3xl border border-accent-lime bg-white p-8 shadow-lg shadow-accent-lime/10">
              <h3 className="text-accent-lime" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 600, lineHeight: 1.25 }}>New Platform</h3>
              <ul className="flex flex-col gap-4">
                {platform.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700" style={{ fontSize: 'clamp(1.125rem, 1.4vw, 1.35rem)', fontWeight: 400, lineHeight: 1.6 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" aria-hidden="true">
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

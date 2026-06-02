'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './reveal'
import { Container } from './container'
import { Section } from './section'

interface Product {
  title: string
  description: string
  headerBg: string
  headerLabel: string
  lowerImage: string
  lowerLabel: string
}

const products: Product[] = [
  { title: "Analytics Dashboard", description: "Real-time market intelligence with customizable views and drag-and-drop widgets.", headerBg: "/products%20images/analytic.jpg", headerLabel: "Analytics", lowerImage: "/products%20images/analytic2.png", lowerLabel: "Dashboard preview" },
  { title: "Prediction Engine", description: "ML-powered forecasts with confidence scoring and backtesting.", headerBg: "/products%20images/predection.png", headerLabel: "Prediction", lowerImage: "/products%20images/prediction2.webp", lowerLabel: "Prediction Engine preview" },
  { title: "Portfolio Tracker", description: "Unified position monitoring across multiple asset classes and accounts.", headerBg: "/products%20images/portfolio.png", headerLabel: "Portfolio", lowerImage: "/products%20images/portfolio2.jpg", lowerLabel: "Portfolio Tracker preview" },
  { title: "API Gateway", description: "Low-latency WebSocket and REST APIs with automatic failover.", headerBg: "/products%20images/api.jpg", headerLabel: "API", lowerImage: "/products%20images/API%202.jpg", lowerLabel: "API Gateway preview" },
]

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal delay={0.1 + index * 0.08}>
      <motion.div
        className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={hovered ? { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } : { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative flex h-56 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${product.headerBg}')` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10" />
        </div>
        <div className="flex flex-col gap-3 p-8">
          <h3 className="text-gray-900" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)', fontWeight: 700, lineHeight: 1.25 }}>{product.title}</h3>
          <p className="text-gray-500" style={{ fontSize: 'clamp(1.125rem, 1.4vw, 1.35rem)', fontWeight: 500, lineHeight: 1.6 }}>{product.description}</p>
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${product.lowerImage}')` }} role="img" aria-label={product.lowerLabel} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  )
}

export function Showcase() {
  return (
    <Section spacing={120} className="bg-white">
      <Container>
        <div className="flex flex-col gap-2">
          <Reveal>
            <span className="uppercase tracking-widest text-gray-500" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em' }}>Products</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section" style={{ fontSize: 'clamp(1.75rem, 2.75vw, 2.5rem)', fontWeight: 640 }}>Everything you need to trade</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-2 max-w-2xl text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 1rem)', fontWeight: 500, lineHeight: 1.5 }}>A suite of interconnected tools designed for serious market participants.</p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {products.map((product, i) => <ProductCard key={product.title} product={product} index={i} />)}
        </div>
      </Container>
    </Section>
  )
}

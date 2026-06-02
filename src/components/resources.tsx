'use client'

import { motion } from 'framer-motion'
import { Reveal } from './reveal'
import { Container } from './container'
import { Section } from './section'

const posts = [
  {
    tag: "Guide",
    title: "Real-time data pipelines for trading: a practical guide",
    image: "/resource/guide.png",
  },
  {
    tag: "Engineering",
    title: "How we reduced WebSocket latency by 40%",
    image: "/resource/engeneer.jpg",
  },
  {
    tag: "Product",
    title: "Why we built a unified risk workspace",
    image: "/resource/product.webp",
  },
]

export function Resources() {
  return (
    <Section spacing={120} className="bg-white">
      <Container>
        <div className="flex flex-col gap-2">
          <Reveal>
            <span className="uppercase tracking-widest text-gray-500" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>Resources</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-section" style={{ fontSize: 'clamp(1.75rem, 2.75vw, 2.5rem)', fontWeight: 620 }}>Latest from the blog</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-2 max-w-2xl text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 1rem)', fontWeight: 450, lineHeight: 1.5 }}>Deep dives, engineering stories, and product updates from the team.</p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.title} delay={0.1 + i * 0.06}>
              <motion.article
                className="flex cursor-pointer flex-col rounded-3xl border border-gray-200 bg-white"
                whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(0,0,0,0.06)' }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex h-56 items-center justify-center overflow-hidden rounded-t-3xl">
                  <img src={post.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col gap-3 p-8">
                  <span className="self-start rounded-full bg-gray-100 px-3 py-1 text-gray-600" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{post.tag}</span>
                  <h3 className="text-gray-900" style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: 600, lineHeight: 1.25 }}>{post.title}</h3>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

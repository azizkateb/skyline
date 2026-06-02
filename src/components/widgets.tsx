'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Check, ChevronRight, Wifi, Battery, Circle, Star, Zap, Layers, Clock, Users, Radio, Sliders, PieChart as PieChartIcon, MessageSquare, Calendar } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Analytics                                                         */
/* ------------------------------------------------------------------ */
export function AnalyticsWidget() {
  const [metric, setMetric] = useState({ accuracy: 98.7, latency: 24, uptime: 99.9 })
  const sparkPath = useRef(
    `M0,${15 - Math.random() * 5} Q${10 + Math.random() * 10},${5 + Math.random() * 8} ${25 + Math.random() * 10},${10 + Math.random() * 4} T${50 + Math.random() * 10},${4 + Math.random() * 6} T${75 + Math.random() * 10},${8 + Math.random() * 5} T100,${3 + Math.random() * 4}`,
  )

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[10px] font-semibold tracking-widest text-blue-300/80">ANALYTICS</div>
      <div className="text-xl font-bold text-white tabular-nums">{metric.accuracy}%</div>
      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
        <ChevronRight className="h-2.5 w-2.5 -rotate-90" />
        <span>+2.3% this week</span>
      </div>
      <svg className="mt-auto h-7 w-full" viewBox="0 0 100 18">
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d={sparkPath.current} fill="none" stroke="url(#spark-grad)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-white/50">
        <span>Latency {metric.latency}ms</span>
        <span>Uptime {metric.uptime}%</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Chat                                                              */
/* ------------------------------------------------------------------ */
interface ChatMessage { role: 'user' | 'assistant'; text: string }

const CHAT_SEED: ChatMessage[] = [
  { role: 'assistant', text: 'How can I help?' },
  { role: 'user', text: 'Show deployment status' },
]

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_SEED)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatEnd = useRef<HTMLDivElement>(null)

  const send = useCallback(() => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input.trim() }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: 'All systems nominal. ✓' }])
      setTyping(false)
    }, 800 + Math.random() * 600)
  }, [input])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  return (
    <div className="flex h-full flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-purple-300/80">
        <MessageSquare className="h-3 w-3" />
        <span>CHAT</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex-1 space-y-1 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-2 py-1 text-[10px] leading-relaxed ${
                  m.role === 'user' ? 'bg-blue-600/60 text-white' : 'bg-white/10 text-white/80'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-0.5 rounded-lg bg-white/10 px-2 py-1">
                <span className="h-1 w-1 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '0ms' }} />
                <span className="h-1 w-1 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '150ms' }} />
                <span className="h-1 w-1 animate-bounce rounded-full bg-white/60" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEnd} />
        </div>
      </div>
      <div className="flex gap-1">
        <input
          className="min-w-0 flex-1 rounded-md bg-white/10 px-2 py-1 text-[10px] text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-blue-500/50"
          placeholder="Message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          className="flex items-center justify-center rounded-md bg-blue-600/60 px-2 py-1 text-white transition-colors hover:bg-blue-600/80"
          onClick={send}
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Calendar                                                          */
/* ------------------------------------------------------------------ */
export function CalendarWidget() {
  const [status, setStatus] = useState<'confirm' | 'hold'>('hold')

  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-amber-300/80">
        <Calendar className="h-3 w-3" />
        <span>LAUNCH</span>
      </div>
      <div className="mt-1 flex items-center gap-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-center">
          <span className="text-[10px] font-bold text-amber-400">24</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-white">Product Launch</span>
          <span className="text-[9px] text-white/50">Thu 14:00 - 15:30</span>
        </div>
      </div>
      <div className="mt-auto flex gap-1.5">
        <button
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-all ${
            status === 'confirm' ? 'bg-emerald-500/70 text-white shadow-sm shadow-emerald-500/20' : 'bg-white/8 text-white/50 hover:bg-white/15'
          }`}
          onClick={() => setStatus('confirm')}
        >
          Confirm
        </button>
        <button
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-all ${
            status === 'hold' ? 'bg-amber-500/70 text-white shadow-sm shadow-amber-500/20' : 'bg-white/8 text-white/50 hover:bg-white/15'
          }`}
          onClick={() => setStatus('hold')}
        >
          Hold
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tasks                                                             */
/* ------------------------------------------------------------------ */
interface Task { label: string; done: boolean }

const TASK_SEED: Task[] = [
  { label: 'Deploy v2.1', done: true },
  { label: 'Run audit', done: false },
  { label: 'Update docs', done: false },
]

export function TaskWidget() {
  const [tasks, setTasks] = useState<Task[]>(TASK_SEED)
  const done = tasks.filter(t => t.done).length
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

  const toggle = (i: number) => setTasks(prev => prev.map((t, j) => (j === i ? { ...t, done: !t.done } : t)))

  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="text-[10px] font-semibold tracking-widest text-rose-300/80">TASKS</div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="text-[10px] font-medium text-white/70">{done}/{tasks.length}</span>
      </div>
      <div className="mt-auto space-y-1">
        {tasks.map((t, i) => (
          <button key={i} className="flex w-full items-center gap-1.5 text-left" onClick={() => toggle(i)}>
            <div
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                t.done ? 'border-emerald-500 bg-emerald-500/60' : 'border-white/20 hover:border-white/40'
              }`}
            >
              {t.done && <Check className="h-2.5 w-2.5 text-white" />}
            </div>
            <span className={`text-[10px] leading-tight ${t.done ? 'text-white/40 line-through' : 'text-white/80'}`}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Team                                                              */
/* ------------------------------------------------------------------ */
export function TeamWidget() {
  const [pinging, setPinging] = useState(false)
  const [ripples, setRipples] = useState<number[]>([])

  const broadcast = () => {
    setPinging(true)
    const id = Date.now()
    setRipples(prev => [...prev, id])
    setTimeout(() => {
      setPinging(false)
      setRipples(prev => prev.filter(r => r !== id))
    }, 1200)
  }

  const members = [
    { name: 'Alex', status: 'online' as const, color: 'bg-emerald-400' },
    { name: 'Sam', status: 'idle' as const, color: 'bg-amber-400' },
    { name: 'Jordan', status: 'online' as const, color: 'bg-emerald-400' },
    { name: 'Casey', status: 'busy' as const, color: 'bg-red-400' },
  ]

  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-cyan-300/80">
        <Users className="h-3 w-3" />
        <span>TEAM</span>
      </div>
      <div className="mt-1 flex items-center">
        {members.map((m, i) => (
          <div
            key={i}
            className="relative -ml-1 first:ml-0"
            style={{ zIndex: members.length - i }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-[9px] font-medium text-white ring-2 ring-slate-800">
              {m.name[0]}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${m.color} ring-1 ring-slate-800`} />
          </div>
        ))}
      </div>
      <button
        className="relative mt-auto flex items-center justify-center gap-1.5 overflow-hidden rounded-md bg-cyan-600/50 py-1.5 text-[10px] font-medium text-white transition-colors hover:bg-cyan-600/70"
        onClick={broadcast}
        disabled={pinging}
      >
        {ripples.map(id => (
          <span
            key={id}
            className="absolute inset-0 animate-ping rounded-md bg-cyan-400/30"
          />
        ))}
        <Radio className="h-3 w-3" />
        <span>BROADCAST PING</span>
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  AI Tuner                                                          */
/* ------------------------------------------------------------------ */
export function TunerWidget() {
  const [power, setPower] = useState(72)
  const [mode, setMode] = useState<'standard' | 'strict'>('standard')

  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-violet-300/80">
        <Sliders className="h-3 w-3" />
        <span>TUNER</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/60">Inference</span>
        <span className="text-[11px] font-bold text-white">{power}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={power}
        onChange={e => setPower(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:shadow-sm"
      />
      <div className="mt-auto flex gap-1.5">
        <button
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-all ${
            mode === 'standard' ? 'bg-violet-500/60 text-white shadow-sm shadow-violet-500/20' : 'bg-white/8 text-white/50 hover:bg-white/15'
          }`}
          onClick={() => setMode('standard')}
        >
          Standard
        </button>
        <button
          className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-all ${
            mode === 'strict' ? 'bg-rose-500/60 text-white shadow-sm shadow-rose-500/20' : 'bg-white/8 text-white/50 hover:bg-white/15'
          }`}
          onClick={() => setMode('strict')}
        >
          Strict
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Memory Allocation                                                 */
/* ------------------------------------------------------------------ */
export function MemoryWidget() {
  const [usage, setUsage] = useState(64)
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - usage / 100)

  const segs = [
    { label: 'Cache', pct: 32, color: '#3b82f6' },
    { label: 'Models', pct: 28, color: '#8b5cf6' },
    { label: 'Buffer', pct: 24, color: '#22c55e' },
    { label: 'Logs', pct: 16, color: '#f59e0b' },
  ]

  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-emerald-300/80">
        <Layers className="h-3 w-3" />
        <span>MEMORY</span>
      </div>
      <div className="flex items-center gap-3">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tabular-nums">{usage}%</span>
          <span className="text-[9px] text-white/40">allocated</span>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-4 gap-1">
        {segs.map(s => (
          <div key={s.label} className="text-center">
            <div className="mx-auto mb-0.5 h-1 w-full max-w-[24px] rounded-full" style={{ backgroundColor: s.color }} />
            <div className="text-[8px] text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Feedback Score                                                    */
/* ------------------------------------------------------------------ */
export function FeedbackWidget() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (v: number) => {
    setRating(v)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="text-[10px] font-semibold tracking-widest text-yellow-300/80">RATING</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(v => {
          const fill = v <= (hovered || rating)
          return (
            <button
              key={v}
              className="transition-transform hover:scale-110"
              onMouseEnter={() => setHovered(v)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleSubmit(v)}
            >
              <Star
                className={`h-5 w-5 transition-colors ${fill ? 'text-yellow-400' : 'text-white/20'}`}
                fill={fill ? 'currentColor' : 'none'}
              />
            </button>
          )
        })}
      </div>
      {submitted && (
        <div className="animate-fadeIn text-[10px] text-emerald-400">
          {rating === 5 ? '★ Perfect!' : rating >= 3 ? 'Thanks!' : 'Noted.'}
        </div>
      )}
    </div>
  )
}

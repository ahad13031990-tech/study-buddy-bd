'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Flame,
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const journey = [
  { label: 'Understand', icon: Brain, state: 'done' },
  { label: 'Practice', icon: Target, state: 'active' },
  { label: 'Improve', icon: Trophy, state: 'next' },
]

const rhythm = [38, 54, 42, 78, 58, 88, 68]

export default function DashboardPage() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
const [question, setQuestion] = useState('')
const [loading, setLoading] = useState(false)
  async function handleLogout() {
    setLoggingOut(true)
    await createClient().auth.signOut()
    router.replace('/login')
    router.refresh()
  }
async function handleSolve() {
  if (!question.trim() || loading) return

  setLoading(true)

  try {
    const response = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.trim(),
        language: 'en',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || 'Unable to solve this question.')
      return
    }

    alert(data.answer || data.explanation || JSON.stringify(data))
  } catch {
    alert('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}
  

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0b12] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-[76px] shrink-0 flex-col items-center rounded-[28px] border border-white/10 bg-white/[0.035] py-5 lg:flex">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#7656ff] shadow-lg shadow-[#7656ff]/30"><Sparkles size={19} /></div>
          <nav className="mt-16 flex flex-col gap-5">
            {[LayoutGrid, MessageCircle, BookOpen, Target, Timer].map((Icon, index) => (
              <button key={index} type="button" aria-label={`Open section ${index + 1}`} className={`flex size-11 items-center justify-center rounded-2xl transition ${index === 0 ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white'}`}><Icon size={19} /></button>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-5"><button type="button" aria-label="Search" className="flex size-11 items-center justify-center rounded-2xl text-white/35 hover:bg-white/5 hover:text-white"><Search size={19} /></button><button type="button" onClick={handleLogout} disabled={loggingOut} aria-label="Log out" className="flex size-11 items-center justify-center rounded-2xl text-white/35 hover:bg-white/5 hover:text-white disabled:opacity-40"><LogOut size={19} /></button></div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/10 pb-4 lg:px-3">
            <div className="flex items-center gap-3"><button type="button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu" className="rounded-xl p-2 text-white/60 lg:hidden">{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button><div className="flex size-9 items-center justify-center rounded-xl bg-[#7656ff] lg:hidden"><Sparkles size={16} /></div><span className="text-sm font-semibold tracking-wide text-white/90">StudyBuddy <span className="hidden text-white/35 sm:inline">/ Command center</span></span></div>
            <div className="flex items-center gap-4"><div className="hidden items-center gap-2 text-xs text-white/45 sm:flex"><span className="size-2 rounded-full bg-[#34d399]" /> All systems focused</div><div className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#1d2030] text-xs font-bold">AH</div></div>
          </header>
          {mobileMenu && <div className="mt-3 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2 lg:hidden"><button className="rounded-xl bg-white/10 px-3 py-2 text-xs">Overview</button><button className="rounded-xl px-3 py-2 text-xs text-white/50">Library</button><button className="rounded-xl px-3 py-2 text-xs text-white/50">Progress</button><button onClick={handleLogout} className="ml-auto rounded-xl px-3 py-2 text-xs text-white/50">Log out</button></div>}

          <section className="flex flex-col justify-between gap-8 py-8 sm:py-12 xl:flex-row xl:items-end">
            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b7cff]">Tuesday, August 18, 2026</p><h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-balance sm:text-6xl">Good evening, Ahad.<br /><span className="text-white/35">Let&apos;s make progress.</span></h1><p className="mt-5 max-w-lg text-sm leading-6 text-white/50">A clear head beats a crowded schedule. You have one focused session waiting for you.</p></div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#ff9d5c]/10 text-[#ffb47d]"><Flame size={19} /></div><div><p className="text-lg font-semibold">7 day streak</p><p className="text-xs text-white/40">You&apos;re building a habit</p></div><ChevronRight size={16} className="ml-3 text-white/25" /></div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
            <div className="relative overflow-hidden rounded-[28px] border border-[#7656ff]/35 bg-[linear-gradient(135deg,rgba(118,86,255,0.22),rgba(20,22,37,0.9)_55%)] p-6 sm:p-8"><div className="absolute -right-20 -top-24 size-72 rounded-full border border-[#9181ff]/10" /><div className="absolute -right-8 -top-12 size-48 rounded-full border border-[#9181ff]/10" /><div className="relative"><div className="flex items-start justify-between"><div><div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b4aaff]"><Sparkles size={14} /> AI workspace</div><h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">What are you working through?</h2><p className="mt-3 max-w-md text-sm leading-6 text-white/50">Ask anything. StudyBuddy turns confusion into a clear next step.</p></div><button type="button" aria-label="More workspace options" className="text-white/35"><MoreHorizontal size={20} /></button></div><div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#080912]/40 px-4 py-3"> <input
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  placeholder="Ask a question about your studies..."
  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
/><button type="button" aria-label="Start asking"
onClick={handleSolve}
disabled={loading} className="ml-auto flex size-9 items-center justify-center rounded-xl bg-[#7656ff] text-white shadow-lg shadow-[#7656ff]/30"><ArrowUpRight size={17} /></button></div><div className="mt-4 flex flex-wrap gap-2"><button className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:bg-white/10">Explain a concept</button><button className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:bg-white/10">Solve a problem</button><button className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55 hover:bg-white/10">Make a study plan</button></div></div></div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6"><div className="flex items-center justify-between"><p className="text-sm font-medium text-white/65">Today&apos;s focus</p><button type="button" aria-label="More focus options" className="text-white/30"><MoreHorizontal size={18} /></button></div><div className="flex items-center gap-6 py-7"><div className="relative flex size-28 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#7656ff 0 68%, rgba(255,255,255,.08) 68% 100%)' }}><div className="flex size-[88px] flex-col items-center justify-center rounded-full bg-[#11121c]"><span className="text-2xl font-semibold">68%</span><span className="text-[10px] text-white/35">complete</span></div></div><div><p className="text-lg font-semibold">Algebra basics</p><p className="mt-1 text-xs leading-5 text-white/40">12 of 18 questions<br />about 24 min left</p></div></div><button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold transition hover:bg-white/15"><Play size={14} fill="currentColor" /> Continue session</button></div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Your study loop</p><h2 className="mt-2 text-xl font-semibold">Small steps, real momentum.</h2></div><button type="button" className="text-xs font-medium text-[#a99dff]">View journey <ArrowUpRight className="ml-1 inline" size={13} /></button></div><div className="mt-8 flex items-start"><div className="flex flex-1 flex-col items-center text-center"><div className="flex size-11 items-center justify-center rounded-full bg-[#34d399]/15 text-[#53e3ae]"><Check size={18} /></div><p className="mt-3 text-xs font-medium">Understand</p><p className="mt-1 text-[11px] text-white/35">Done</p></div><div className="mt-5 h-px flex-1 bg-gradient-to-r from-[#34d399] to-[#7656ff]" />{journey.slice(1).map(({ label, icon: Icon, state }) => <div key={label} className="flex flex-1 flex-col items-center text-center"><div className={`flex size-11 items-center justify-center rounded-full ${state === 'active' ? 'bg-[#7656ff] text-white shadow-lg shadow-[#7656ff]/30' : 'border border-white/15 text-white/30'}`}><Icon size={18} /></div><p className={`mt-3 text-xs font-medium ${state === 'active' ? 'text-white' : 'text-white/45'}`}>{label}</p><p className="mt-1 text-[11px] text-white/35">{state === 'active' ? 'In progress' : 'Up next'}</p></div>)}</div></div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Learning rhythm</p><h2 className="mt-2 text-xl font-semibold">You show up consistently.</h2></div><Zap size={18} className="text-[#fbbf24]" /></div><div className="mt-8 flex h-28 items-end gap-2">{rhythm.map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full rounded-t-md ${index === 5 ? 'bg-[#7656ff]' : 'bg-[#7656ff]/25'}`} style={{ height: `${height}%` }} /><span className="text-[10px] text-white/30">{['M','T','W','T','F','S','S'][index]}</span></div>)}</div><div className="mt-5 flex items-center gap-2 text-xs text-white/40"><span className="size-2 rounded-full bg-[#7656ff]" /> 4.8 hrs this week <span className="text-[#34d399]">+32%</span></div></div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div className="rounded-[28px] border border-[#fbbf24]/20 bg-[#fbbf24]/[0.06] p-6"><div className="flex size-10 items-center justify-center rounded-xl bg-[#fbbf24]/10 text-[#fbbf24]"><Sparkles size={18} /></div><p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#fbbf24]/65">AI insight</p><h2 className="mt-2 text-xl font-semibold leading-tight">Your best sessions happen after 8 PM.</h2><p className="mt-3 text-sm leading-6 text-white/45">Try protecting that time for one focused concept instead of a long to-do list.</p><button className="mt-6 text-xs font-semibold text-[#fbbf24]">Build an evening plan <ArrowUpRight className="ml-1 inline" size={13} /></button></div><div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-white/35">Recent learning</p><h2 className="mt-2 text-xl font-semibold">Your study timeline</h2></div><button type="button" aria-label="More recent learning options" className="text-white/30"><MoreHorizontal size={18} /></button></div><div className="mt-6 flex flex-col gap-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[#7656ff]/15 text-[#a99dff]"><Brain size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">Quadratic equations</p><p className="text-xs text-white/35">Practiced with StudyBuddy</p></div><span className="text-xs text-white/30">Today</span></div><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[#34d399]/15 text-[#53e3ae]"><Check size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">Linear functions</p><p className="text-xs text-white/35">Session completed</p></div><span className="text-xs text-white/30">Yesterday</span></div></div></div></section>

          <div className="sticky bottom-4 z-10 mx-auto mt-8 flex w-fit items-center gap-1 rounded-2xl border border-white/10 bg-[#171824]/90 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl"> <button
  type="button"
  onClick={() => {
    document.querySelector<HTMLInputElement>(
      'input[placeholder="Ask a question about your studies..."]'
    )?.focus()
  }}
  className="flex items-center gap-2 rounded-xl bg-[#7656ff] px-4 py-2.5 text-xs font-semibold"
>
  <Plus size={14} /> New session
</button><button type="button" className="rounded-xl px-3 py-2.5 text-xs text-white/45 hover:bg-white/10">Library</button><button type="button" className="rounded-xl px-3 py-2.5 text-xs text-white/45 hover:bg-white/10">Progress</button></div>
        </div>
      </div>
    </main>
  )
}

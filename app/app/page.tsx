'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await createClient().auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><span className="font-semibold">StudyBuddy</span></div>
          <button type="button" onClick={handleLogout} disabled={loggingOut} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50">{loggingOut ? 'Signing out…' : 'Log out'}</button>
        </header>
        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm"><p className="text-sm font-medium text-primary">Your workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome to StudyBuddy</h1><p className="mt-3 max-w-2xl text-muted-foreground">Your personalized study companion is ready. Ask a question, solve a problem, or start a focused study session.</p><div className="mt-7 flex flex-wrap gap-3"><button type="button" className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Ask StudyBuddy</button><button type="button" className="rounded-xl border border-border px-5 py-3 font-semibold">Practice a topic</button></div></section>
      </div>
    </main>
  )
}

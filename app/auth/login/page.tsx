'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const REMEMBERED_EMAIL_KEY = 'studybuddy-remembered-email'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY)
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message.toLowerCase().includes('confirm') ? 'Please confirm your email before signing in.' : 'Invalid email or password.')
      setLoading(false)
      return
    }

    if (rememberMe) window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
    else window.localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    window.location.assign('/')
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your StudyBuddy journey.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Sign in">
        <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="email">
          Email
          <input id="email" name="email" type="email" autoComplete="username" inputMode="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-input bg-background px-3 py-3 outline-none ring-offset-background focus:ring-2 focus:ring-ring" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">
          Password
          <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-input bg-background px-3 py-3 outline-none ring-offset-background focus:ring-2 focus:ring-ring" />
        </label>
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground" htmlFor="remember-me">
            <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="size-4 rounded border-input accent-primary" />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="font-semibold text-primary hover:underline">Forgot password?</Link>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to StudyBuddy? <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">Create an account</Link></p>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><span className="font-semibold">StudyBuddy</span></div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p><div className="mt-7">{children}</div></section></main>
}

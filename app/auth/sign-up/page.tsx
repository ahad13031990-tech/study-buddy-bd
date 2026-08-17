'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function signUpMessage(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('password')) return 'Choose a stronger password with at least 6 characters.'
  if (normalized.includes('already') || normalized.includes('registered')) return 'Unable to create this account. Please check your details.'
  if (normalized.includes('rate limit') || normalized.includes('too many')) return 'Too many attempts. Please wait a moment and try again.'
  return 'Unable to create this account. Please check your details and try again.'
}

export default function SignUpPage() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(''); setMessage('')
    const { data, error: authError } = await createClient().auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`, data: { full_name: name.trim() } } })
    if (authError) setError(signUpMessage(authError.message)); else setMessage(data.session ? 'Account created. You can now continue.' : 'Account created. Check your email to confirm your account.')
    setLoading(false)
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><span className="font-semibold">StudyBuddy</span></div><h1 className="text-3xl font-bold tracking-tight">Create your account</h1><p className="mt-2 text-sm text-muted-foreground">Start learning smarter with your personal study companion.</p><form onSubmit={submit} className="mt-7 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="name">Name<input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">Password<input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:border-primary" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}{message && <p role="status" className="text-sm text-primary">{message}</p>}<button type="submit" disabled={loading} className="rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Creating account…' : 'Sign up'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-semibold text-primary" href="/auth/login">Log in</Link></p></section></main>
}

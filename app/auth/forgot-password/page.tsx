'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset-password`
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, { redirectTo })
    if (resetError) setError('We could not send a reset email right now. Please try again.')
    else setMessage('If an account exists for that email, you will receive password reset instructions shortly.')
    setLoading(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><span className="font-semibold">StudyBuddy</span></div><h1 className="text-3xl font-bold tracking-tight">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">We&apos;ll send a secure reset link to your email.</p><form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-medium" htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-input bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>{message && <p role="status" className="text-sm text-primary">{message}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button type="submit" disabled={loading} className="rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Sending…' : 'Send reset link'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground"><Link href="/auth/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></p></section></main>
}

'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    window.location.assign('/app')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            S
          </div>
          <span className="font-semibold">StudyBuddy</span>
        </div>

        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue your StudyBuddy journey.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to StudyBuddy?{' '}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}

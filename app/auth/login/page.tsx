'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function continueWithGoogle() {
    setLoading(true)
    setError('')
    const { error: authError } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { access_type: 'offline', prompt: 'select_account' },
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })
    if (authError) {
      setError('Google sign-in is unavailable right now. Please try again.')
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your StudyBuddy journey.">
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-background py-3 font-semibold transition-colors hover:bg-muted disabled:opacity-50"
      >
        <GoogleIcon />
        {loading ? 'Connecting to Google…' : 'Continue with Google'}
      </button>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <p className="mt-6 text-center text-xs text-muted-foreground">You will choose a Google account in the secure Google sign-in window.</p>
    </AuthShell>
  )
}

function GoogleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5"><path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"/><path fill="#34A853" d="M12 21.72c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.72Z"/><path fill="#FBBC05" d="M6.54 13.8A5.85 5.85 0 0 1 6.23 12c0-.62.11-1.23.31-1.8V7.67H3.3A9.75 9.75 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.33l3.24-2.53Z"/><path fill="#EA4335" d="M12 6.17c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.16 14.63 2.28 12 2.28a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"/></svg>
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><span className="font-semibold">StudyBuddy</span></div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p><div className="mt-7">{children}</div></section></main>
}

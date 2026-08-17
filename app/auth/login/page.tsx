'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); const { error } = await createClient().auth.signInWithPassword({ email, password }); if (error) setError(error.message.toLowerCase().includes('confirm') ? 'Please confirm your email before signing in.' : 'Invalid email or password.'); else router.replace('/'); setLoading(false) }
  return <AuthShell title="Welcome back" subtitle="Sign in to continue your StudyBuddy journey."><form onSubmit={submit} className="flex flex-col gap-4"><Field label="Email" type="email" value={email} onChange={setEmail} /><Field label="Password" type="password" value={password} onChange={setPassword} />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={loading} className="rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Signing in…' : 'Log in'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">New to StudyBuddy? <Link className="font-semibold text-primary" href="/auth/sign-up">Create an account</Link></p></AuthShell>
}
function Field({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) { return <label className="flex flex-col gap-2 text-sm font-medium">{label}<input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:border-primary" /></label> }
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><span className="font-semibold">StudyBuddy</span></div><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p><div className="mt-7">{children}</div></section></main> }

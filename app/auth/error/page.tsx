import Link from 'next/link'

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams
  const message = params.message === 'missing-code' ? 'This sign-in link is incomplete.' : 'This authentication link is invalid or expired.'
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground"><section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-sm"><div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">S</div><h1 className="mt-6 text-2xl font-bold">Authentication problem</h1><p role="alert" className="mt-3 text-sm text-muted-foreground">{message}</p><Link href="/auth/login" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Back to sign in</Link></section></main>
}

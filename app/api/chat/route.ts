import { NextResponse } from 'next/server'
import { aiProvider, hasAIProvider } from '@/lib/ai/provider'

export async function POST(request: Request) {
  try {
    const { messages = [] } = await request.json()
    if (!Array.isArray(messages) || !messages.length) return NextResponse.json({ error: 'A message is required.' }, { status: 400 })
    if (!hasAIProvider()) return NextResponse.json({ message: 'I’m in development mode right now. Add AI_API_KEY to connect me to a live tutor. Try breaking the topic into one small question at a time.' })
    const message = await aiProvider.complete([{ role: 'system', content: 'You are StudyBuddy, a kind tutor. Answer clearly, and use Bangla when the student asks in Bangla.' }, ...messages.slice(-12)])
    return NextResponse.json({ message })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Chat request failed.' }, { status: 500 }) }
}

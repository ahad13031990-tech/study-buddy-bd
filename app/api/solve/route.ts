import { NextResponse } from 'next/server'
import { solveQuestion } from '@/lib/ai/solve-question'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const question = typeof body.question === 'string' ? body.question.trim() : ''
    const image = typeof body.image === 'string' && body.image ? body.image : undefined
    if (!question && !image) return NextResponse.json({ error: 'Please enter a question or upload an image.' }, { status: 400 })
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'Gemini is not configured. Add GEMINI_API_KEY in the project environment variables.' }, { status: 503 })

    const result = await solveQuestion({
      question,
      image,
      subject: typeof body.subject === 'string' ? body.subject : 'General',
      educationLevel: typeof body.educationLevel === 'string' ? body.educationLevel : 'Student',
      language: body.language === 'bn' ? 'bn' : 'en',
    })
    return NextResponse.json(result)
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : 'Unable to solve this question.'
    const message = /429|quota|rate limit|exceeded your current quota/i.test(rawMessage) ? 'AI limit reached. Please try again later.' : rawMessage
    const status = /not configured/i.test(message) ? 503 : /invalid|rate limit|connect|failure|empty|structured|unsupported image/i.test(message) ? 502 : 500
    return NextResponse.json({ error: message }, { status })
  }
}




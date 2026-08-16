import { NextResponse } from 'next/server'
import { aiProvider, hasAIProvider } from '@/lib/ai/provider'

const fallback = (topic: string, count: number) => ({ questions: Array.from({ length: count }, (_, i) => ({ question: `Which statement best describes ${topic || 'this topic'}?`, options: ['A core definition', 'An unrelated idea', 'A common misconception', 'None of these'], correctAnswer: 0, explanation: 'Review the core definition and connect it to an example.' })) })
export async function POST(request: Request) {
  try {
    const { topic, subject, difficulty, count = 5 } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Enter a topic first.' }, { status: 400 })
    const safeCount = Math.min(10, Math.max(1, Number(count) || 5))
    return NextResponse.json(fallback(topic, safeCount))
    const content = await aiProvider.complete([{ role: 'system', content: 'Create a quiz. Return JSON: {questions:[{question,options,correctAnswer,explanation}]}.' }, { role: 'user', content: `${subject} / ${difficulty}: ${topic}. Make ${safeCount} questions.` }], { json: true })
    return NextResponse.json(JSON.parse(content))
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Quiz generation failed.' }, { status: 500 }) }
}



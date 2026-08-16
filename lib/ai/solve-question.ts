import { aiProvider, hasAIProvider } from './provider'

export type SolveInput = { question: string; subject: string; educationLevel: string; language: 'bn' | 'en'; image?: string }
export type SolveResponse = { answer: string; explanation: string; banglaExplanation: string; keyConcept: string; commonMistake: string }

function parseJson(content: string): Partial<SolveResponse> {
  const cleaned = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
  return JSON.parse(cleaned) as Partial<SolveResponse>
}

export async function solveQuestion(input: SolveInput): Promise<SolveResponse> {
  if (!hasAIProvider()) throw new Error('GEMINI_API_KEY is not configured')

  const prompt = `Return only valid JSON with exactly these string keys: answer, explanation, banglaExplanation, keyConcept, commonMistake.

Student level: ${input.educationLevel}
Subject: ${input.subject}
Requested language: ${input.language === 'bn' ? 'Bangla' : 'English'}
${input.question ? `Question text: ${input.question}` : 'Question text: Read the academic question from the uploaded image.'}

If an image is attached, carefully read the complete question from it before solving. If the image is unclear, say so instead of guessing.

Write the main answer and explanation in the requested language. Always provide banglaExplanation in simple Bangla. Keep calculations clear for math and science.`

  const content = await aiProvider.complete([{ role: 'user', content: prompt }], { json: true, image: input.image })

  try {
    const parsed = parseJson(content)
    const keys: (keyof SolveResponse)[] = ['answer', 'explanation', 'banglaExplanation', 'keyConcept', 'commonMistake']
    if (keys.some((key) => typeof parsed[key] !== 'string' || !parsed[key]?.trim())) throw new Error('missing response fields')
    return parsed as SolveResponse
  } catch {
    throw new Error('Gemini returned an invalid structured response')
  }
}

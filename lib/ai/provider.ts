export type AIMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export type AIProvider = {
  complete(messages: AIMessage[], options?: { json?: boolean; image?: string }): Promise<string>
}

const SYSTEM_INSTRUCTION = `You are StudyBuddy BD, an AI tutor for Bangladeshi students.

Your job is to help students understand academic questions rather than simply giving unexplained answers.

For every question:
- Give the correct answer.
- Explain the reasoning step by step.
- Explain difficult concepts in simple Bangla when Bangla is requested.
- Use examples when useful.
- For mathematics and science, show calculations clearly.
- Do not invent facts.
- If the question is ambiguous, say what information is missing.`

function getErrorMessage(payload: unknown, status: number, statusText: string) {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: { message?: string } }).error
    if (error?.message) return error.message
  }
  return `${status} ${statusText}`.trim()
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i)
  if (!match) throw new Error('Unsupported image format. Please upload a PNG, JPEG, or WebP image.')
  return { mimeType: match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase(), data: match[2] }
}

class GeminiProvider implements AIProvider {
  async complete(messages: AIMessage[], options?: { json?: boolean; image?: string }): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY?.trim()
    const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash'
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server')

    const prompt = messages
      .filter((message) => message.role !== 'system')
      .map((message) => `${message.role === 'assistant' ? 'Tutor' : 'Student'}: ${message.content}`)
      .join('\n\n')

    const parts: Array<Record<string, unknown>> = [{ text: prompt }]
    if (options?.image) {
      const image = parseDataUrl(options.image)
      parts.push({ inline_data: { mime_type: image.mimeType, data: image.data } })
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`
    const generationConfig: Record<string, unknown> = {}
    if (options?.json) generationConfig.responseMimeType = 'application/json'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: 'user', parts }],
        generationConfig,
      }),
      signal: AbortSignal.timeout(30000),
    })

    const raw = await response.text()
    let payload: unknown
    try { payload = raw ? JSON.parse(raw) : null } catch { payload = raw }

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${getErrorMessage(payload, response.status, response.statusText)}`)
    }

    const data = payload as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || ''
    if (!text) throw new Error('Gemini API error: response contained no generated text')
    return text
  }
}

export const aiProvider: AIProvider = new GeminiProvider()
export const hasAIProvider = () => Boolean(process.env.GEMINI_API_KEY?.trim())
export { SYSTEM_INSTRUCTION }

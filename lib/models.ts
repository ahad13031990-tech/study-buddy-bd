export type Profile = { id: string; fullName: string; educationLevel?: string }
export type Question = { id: string; userId: string; question: string; subject: string; result: unknown; createdAt: string }
export type Conversation = { id: string; userId: string; title: string; createdAt: string }
export type Message = { id: string; conversationId: string; role: 'user' | 'assistant'; content: string; createdAt: string }
export type QuizAttempt = { id: string; userId: string; topic: string; score: number; total: number; createdAt: string }
export type Subscription = { id: string; userId: string; plan: 'free' | 'plus'; status: string }

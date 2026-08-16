export type SavedQuestion = { id: string; question: string; subject: string; createdAt: string; result: { answer: string; explanation: string; banglaExplanation: string; keyConcept: string; commonMistake: string } }
const KEY = 'studybuddy.questions'
export function getQuestions(): SavedQuestion[] { if (typeof window === 'undefined') return []; try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
export function saveQuestion(question: Omit<SavedQuestion, 'id' | 'createdAt'>): SavedQuestion { const saved = { ...question, id: crypto.randomUUID(), createdAt: new Date().toISOString() }; localStorage.setItem(KEY, JSON.stringify([saved, ...getQuestions()])); return saved }
export function getQuestion(id: string) { return getQuestions().find((question) => question.id === id) }
export function deleteQuestion(id: string) { localStorage.setItem(KEY, JSON.stringify(getQuestions().filter((question) => question.id !== id))) }

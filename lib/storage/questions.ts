import { createClient } from '@/lib/supabase/client'

export type SavedQuestion = { id: string; question: string; subject: string; createdAt: string; result: { answer: string; explanation: string; banglaExplanation: string; keyConcept: string; commonMistake: string } }

type Row = { id: string; question: string; subject: string; result: SavedQuestion['result']; created_at: string }
function mapRow(row: Row): SavedQuestion { return { id: row.id, question: row.question, subject: row.subject, result: row.result, createdAt: row.created_at } }
export async function getQuestions(): Promise<SavedQuestion[]> { const { data, error } = await createClient().from('saved_questions').select('id, question, subject, result, created_at').order('created_at', { ascending: false }); if (error) throw error; return (data as Row[]).map(mapRow) }
export async function saveQuestion(question: Omit<SavedQuestion, 'id' | 'createdAt'>) { const { data, error } = await createClient().from('saved_questions').insert({ question: question.question, subject: question.subject, result: question.result, user_id: (await createClient().auth.getUser()).data.user?.id }).select('id, question, subject, result, created_at').single(); if (error) throw error; return mapRow(data as Row) }
export async function deleteQuestion(id: string) { const { error } = await createClient().from('saved_questions').delete().eq('id', id); if (error) throw error }

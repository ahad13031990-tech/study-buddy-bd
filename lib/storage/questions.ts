import { supabase } from '@/lib/supabase/client'

export type SavedQuestion = {
  id: string
  question: string
  subject: string
  createdAt: string
  result: {
    answer: string
    explanation: string
    banglaExplanation: string
    keyConcept: string
    commonMistake: string
  }
}

export async function getQuestions(): Promise<SavedQuestion[]> {
  const { data } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

  return (data || []).map((q) => ({
    id: q.id,
    question: q.question,
    subject: q.subject || '',
    createdAt: q.created_at,
    result: q.result,
  }))
}

export async function saveQuestion(
  question: Omit<SavedQuestion, 'id' | 'createdAt'>
): Promise<SavedQuestion | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('questions')
    .insert({
      user_id: user.id,
      question: question.question,
      subject: question.subject,
      result: question.result,
    })
    .select()
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    question: data.question,
    subject: data.subject || '',
    createdAt: data.created_at,
    result: data.result,
  }
}

export async function getQuestion(id: string) {
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) return undefined

  return {
    id: data.id,
    question: data.question,
    subject: data.subject || '',
    createdAt: data.created_at,
    result: data.result,
  }
}

export async function deleteQuestion(id: string) {
  await supabase.from('questions').delete().eq('id', id)
}

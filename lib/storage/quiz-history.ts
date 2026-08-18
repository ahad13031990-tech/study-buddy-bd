import { supabase } from '@/lib/supabase/client'

export async function saveQuizHistory(topic: string, score: number, total: number) {
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Quiz auth error:', userError?.message || 'No logged-in user')
    return false
  }

  const { error } = await supabase.from('quiz_history').insert({
    user_id: user.id,
    topic,
    score,
    total,
  })

  if (error) {
    console.error('Quiz save error:', error.message)
    return false
  }

  return true
}

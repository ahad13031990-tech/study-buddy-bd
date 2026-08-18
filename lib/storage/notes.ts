export type StudyNote = {
  id: string
  title: string
  subject: string
  topic: string
  content: {
    overview: string
    keyConcepts: string[]
    importantPoints: string[]
    definitions: string[]
    examples: string[]
    quickRevision: string[]
  }
  createdAt: string
}

const KEY = 'studybuddy_notes'

export function getNotes(): StudyNote[] {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveNote(note: Omit<StudyNote, 'id' | 'createdAt'>): StudyNote {
  const newNote: StudyNote = {
    ...note,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  const notes = [newNote, ...getNotes()]
  localStorage.setItem(KEY, JSON.stringify(notes))

  return newNote
}

export function deleteNote(id: string) {
  const notes = getNotes().filter((note) => note.id !== id)
  localStorage.setItem(KEY, JSON.stringify(notes))
}

'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Bell, BrainCircuit, Check, FileQuestion, Flame, History, LayoutDashboard, Menu, MessageCircle, Send, Settings, Sparkles, Target, Trophy, Upload, X } from 'lucide-react'
import { getQuestions, saveQuestion, type SavedQuestion } from '@/lib/storage/questions'
import { saveQuizHistory } from '@/lib/storage/quiz-history'
import { getNotes, saveNote, deleteNote, type StudyNote } from '@/lib/storage/notes'

type Solve = { answer: string; explanation: string; banglaExplanation: string; keyConcept: string; commonMistake: string; fallback?: boolean }
type ChatMessage = { role: 'user' | 'assistant'; content: string }
type QuizQuestion = { question: string; options: string[]; correctAnswer: number; explanation: string }
const navItems = [['Dashboard', LayoutDashboard], ['Solve Question', BrainCircuit], ['AI Tutor', MessageCircle], ['Quiz', FileQuestion], ['Study Notes', BrainCircuit], ['History', History], ['Mistakes', Check], ['Progress', BarChart3], ['Settings', Settings]] as const

export default function Page() {
  const [active, setActive] = useState('Dashboard')
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('Physics')
  const [level, setLevel] = useState('SSC')
  const [result, setResult] = useState<Solve | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<SavedQuestion[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [followUp, setFollowUp] = useState('')
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [tutorInput, setTutorInput] = useState('')
  const [quizTopic, setQuizTopic] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizDone, setQuizDone] = useState(false)
  const [quizLoading, setQuizLoading] = useState(false)
  const [mistakes, setMistakes] = useState<QuizQuestion[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [noteTopic, setNoteTopic] = useState('')
  const [noteSubject, setNoteSubject] = useState('Physics')
  const [noteLoading, setNoteLoading] = useState(false)

  useEffect(() => { async function loadData() { setHistory(await getQuestions()); setNotes(getNotes()) }; loadData() }, [])
  const go = (name: string) => { setActive(name); setSidebarOpen(false) }
  async function solve() {
    if (!question.trim() && !image) { setError('Please enter a question or add an image.'); return }
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/solve', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question, subject, educationLevel: level, language: 'en', image }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to solve this question.')
      setResult(data)
      if (question.trim()) { await saveQuestion({ question, subject, result: data }); setHistory(await getQuestions()) }
    } catch (e) { setError(e instanceof Error ? e.message : 'Network error. Please try again.') } finally { setLoading(false) }
  }
   async function sendChat(text: string) {
    if (!text.trim()) return

    const context = result
      ? `Previous question: ${question || 'Question from screenshot'}

Previous answer: ${result.answer}

Previous explanation: ${result.explanation}

Previous Bangla explanation: ${result.banglaExplanation}

Student follow-up: ${text}`
      : text

    const next = [...chat, { role: 'user' as const, content: text }]
    setChat(next)
    setFollowUp('')
    setTutorInput('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: context },
            ...next
          ]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Chat failed.')
      }

      setChat([...next, { role: 'assistant', content: data.message }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chat failed.')
    } finally {
      setLoading(false)
    }
  }
  async function generateNote() {
    if (!noteTopic.trim()) {
      setError('Please enter a topic or chapter.')
      return
    }

    setNoteLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Create structured study notes for ${noteSubject}, topic: ${noteTopic}. Return ONLY valid JSON with this exact structure: {"title":"string","overview":"string","keyConcepts":["string"],"importantPoints":["string"],"definitions":["string"],"examples":["string"],"quickRevision":["string"]}. Make it clear and student-friendly.`
          }]
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to generate notes.')

      const raw = String(data.message || '').replace(/```json|```/g, '').trim()
      const generated = JSON.parse(raw)

      const note = saveNote({
        title: generated.title || noteTopic,
        subject: noteSubject,
        topic: noteTopic,
        content: {
          overview: generated.overview || '',
          keyConcepts: generated.keyConcepts || [],
          importantPoints: generated.importantPoints || [],
          definitions: generated.definitions || [],
          examples: generated.examples || [],
          quickRevision: generated.quickRevision || []
        }
      })

      setNotes((items) => [note, ...items])
      setNoteTopic('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to generate notes.')
    } finally {
      setNoteLoading(false)
    }
  }
  function Header({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-primary">Friday, August 15, 2026</p><h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p></div><button onClick={() => go('Solve Question')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Solve a question <ArrowRight size={15} /></button></div> }
  async function generateQuiz() {
    if (!quizTopic.trim()) {
      setError('Please enter a quiz topic.')
      return
    }

    setQuizLoading(true)
    setError('')
    setQuiz([])
    setQuizIndex(0)
    setQuizAnswers([])
    setQuizDone(false)

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate quiz.')
      }

      setQuiz(data.questions || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to generate quiz.')
    } finally {
      setQuizLoading(false)
    }
  }

  function DashboardView() { return <><Header title="Good morning, Arif" subtitle="Ready to make progress today?" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Study streak" value={history.length ? '1 day' : '0 days'} icon={Flame} /><Stat label="Questions solved" value={String(history.length)} icon={Trophy} /><Stat label="Quiz attempts" value="0" icon={Target} /><Stat label="Study time" value="0m" icon={BarChart3} /></div><div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]"><section className="rounded-2xl border border-border bg-card p-6"><div className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles size={16} /> AI Study Assistant</div><textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is Newton's second law?" className="min-h-32 w-full resize-none rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary" /><button onClick={solve} disabled={loading} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Solving…' : 'Solve with AI'} <ArrowRight size={15} /></button></section><section className="rounded-2xl bg-primary p-6 text-primary-foreground"><p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Today’s focus</p><h2 className="mt-2 text-2xl font-bold">Build a study habit</h2><p className="mt-4 text-sm text-primary-foreground/75">Solve one question, then ask a follow-up to deepen your understanding.</p><button onClick={() => go('Quiz')} className="mt-6 w-full rounded-lg bg-primary-foreground px-3.5 py-2.5 text-sm font-semibold text-primary">Start a quiz</button></section></div><HistoryList /></> }
  function SolveView() { return <><Header title="Solve Question" subtitle="Turn confusion into confidence, one step at a time." /><div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]"><section className="rounded-2xl border border-border bg-card p-6"><div className="flex flex-wrap gap-3"><select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm"><option>Physics</option><option>Mathematics</option><option>Chemistry</option><option>Biology</option></select><select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm"><option>SSC</option><option>HSC</option><option>University</option></select></div><textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Paste your question here…" className="mt-5 min-h-48 w-full resize-y rounded-xl border border-input bg-background p-4 text-sm outline-none focus:border-primary" /><label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"><Upload size={16} /> Add screenshot<input type="file" accept="image/*" className="hidden" onChange={(e) => { const selected = e.target.files?.[0]; if (!selected) return; setFile(selected); const reader = new FileReader(); reader.onload = () => setImage(String(reader.result)); reader.readAsDataURL(selected) }} /></label>{image && <div className="mt-4 flex items-center gap-3"><img src={image} alt="Uploaded question" className="size-20 rounded-lg object-cover" /><button onClick={() => { setImage(null); setFile(null) }} className="text-sm text-destructive">Remove image</button></div>}<button onClick={solve} disabled={loading} className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Thinking…' : 'Solve with AI'}</button></section><Result /></div></> }
  function Result() { return <section className="rounded-2xl border border-border bg-card p-6"><h2 className="font-bold">AI result</h2>{!result ? <p className="mt-4 text-sm text-muted-foreground">Your answer will appear here.</p> : <div className="mt-5 flex flex-col gap-5 text-sm"><Answer label="Answer" value={result.answer} /><Answer label="Explanation" value={result.explanation} /><Answer label="Bangla explanation" value={result.banglaExplanation} /><Answer label="Key concept" value={result.keyConcept} /><Answer label="Common mistake" value={result.commonMistake} /><div className="border-t border-border pt-4"><div className="flex gap-2"><input value={followUp} onChange={(e) => setFollowUp(e.target.value)} placeholder="Ask a follow-up…" className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2" /><button onClick={() => sendChat(followUp)} className="rounded-lg bg-primary px-3 text-primary-foreground"><Send size={16} /></button></div>{chat.map((message, index) => <p key={index} className="mt-3 rounded-lg bg-muted p-3"><strong>{message.role === 'user' ? 'You' : 'StudyBuddy'}:</strong> {message.content}</p>)}</div></div>}</section> }
  function TutorView() { return <><Header title="AI Tutor" subtitle="Ask a question and learn through conversation." /><section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6"><div className="flex min-h-80 flex-col gap-3">{chat.length === 0 && <p className="m-auto text-center text-sm text-muted-foreground">Start with a question or choose a quick action.</p>}{chat.map((message, index) => <div key={index} className={`max-w-[85%] rounded-xl p-3 text-sm ${message.role === 'user' ? 'self-end bg-primary text-primary-foreground' : 'bg-muted'}`}>{message.content}</div>)}{loading && <p className="text-sm text-muted-foreground">Tutor is thinking…</p>}</div><div className="mt-5 flex flex-wrap gap-2">{['Explain this simply', 'Give me an example', 'Teach me step by step', 'Quiz me', 'Explain in Bangla'].map((action) => <button key={action} onClick={() => sendChat(action)} className="rounded-full border border-border px-3 py-2 text-xs">{action}</button>)}</div><div className="mt-4 flex gap-2"><input value={tutorInput} onChange={(e) => setTutorInput(e.target.value)} placeholder="Ask your tutor…" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm" /><button onClick={() => sendChat(tutorInput)} className="rounded-xl bg-primary px-4 text-primary-foreground"><Send size={17} /></button></div></section></> }
  const current = quiz[quizIndex]
  const score = quiz.reduce((total, item, index) => total + (quizAnswers[index] === item.correctAnswer ? 1 : 0), 0)

  function QuizView() { return <><Header title="Quiz Generator" subtitle="Practice actively and see what you know." /><section className="rounded-2xl border border-border bg-card p-6">{!quiz.length ? <div className="flex gap-3"><input value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} placeholder="Topic, e.g. Newton's laws" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm" /><button onClick={generateQuiz} disabled={quizLoading} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{quizLoading ? 'Generating…' : 'Generate Quiz'}</button></div> : quizDone ? <div className="py-10 text-center"><Trophy className="mx-auto text-primary" size={40} /><h2 className="mt-4 text-3xl font-bold">{score} / {quiz.length}</h2><p className="mt-2 text-sm text-muted-foreground">Quiz complete.</p><button onClick={() => setQuiz([])} className="mt-5 rounded-xl border border-border px-4 py-2 text-sm">Create another quiz</button></div> : <><div className="mb-6 flex justify-between text-sm"><span>Question {quizIndex + 1} of {quiz.length}</span><span>{Math.round((quizIndex / quiz.length) * 100)}%</span></div><h2 className="text-xl font-bold">{current.question}</h2><div className="mt-5 grid gap-3">{current.options.map((option, index) => <button key={option} onClick={() => { setQuizAnswers((answers) => { const next = [...answers]; next[quizIndex] = index; return next }); if (index !== current.correctAnswer && !mistakes.some((m) => m.question === current.question)) setMistakes((items) => [...items, current]) }} className={`rounded-xl border p-3 text-left text-sm ${quizAnswers[quizIndex] === index ? 'border-primary bg-primary/10' : ''}`}>{option}</button>)}</div><button disabled={quizAnswers[quizIndex] === undefined} onClick={() => quizIndex === quiz.length - 1 ? (saveQuizHistory(quizTopic, score, quiz.length), setQuizDone(true)) : setQuizIndex((index) => index + 1)} className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{quizIndex === quiz.length - 1 ? 'Submit quiz' : 'Next question'}</button></>}</section></> }
  function NotesView() {
    return <><Header title="Study Notes" subtitle="Generate clear notes and revise faster." />
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
          <select value={noteSubject} onChange={(e) => setNoteSubject(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-3 text-sm">
            <option>Physics</option>
            <option>Mathematics</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>
          <input value={noteTopic} onChange={(e) => setNoteTopic(e.target.value)} placeholder="Chapter or topic, e.g. Newton's Laws" className="rounded-xl border border-input bg-background px-4 py-3 text-sm" />
          <button onClick={generateNote} disabled={noteLoading} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {noteLoading ? 'Generating...' : 'Generate Notes'}
          </button>
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {notes.length === 0 ? <p className="rounded-xl bg-muted p-5 text-sm text-muted-foreground">No study notes yet. Generate your first note above.</p> :
          notes.map((note) => <article key={note.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-primary">{note.subject}</span>
                <h2 className="mt-1 text-lg font-bold">{note.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{note.topic}</p>
              </div>
              <button onClick={() => { deleteNote(note.id); setNotes((items) => items.filter((item) => item.id !== note.id)) }} className="text-xs text-destructive">Delete</button>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">{note.content.overview}</p>

            <div className="mt-4">
              <h3 className="text-sm font-semibold">Key Concepts</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {note.content.keyConcepts.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>

            <details className="mt-4 rounded-xl bg-muted p-4">
              <summary className="cursor-pointer text-sm font-semibold">More revision material</summary>
              <div className="mt-4 space-y-4 text-sm">
                <div><strong>Important Points</strong><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{note.content.importantPoints.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
                <div><strong>Definitions</strong><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{note.content.definitions.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
                <div><strong>Examples</strong><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{note.content.examples.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
                <div><strong>Quick Revision</strong><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{note.content.quickRevision.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
              </div>
            </details>
          </article>)
        }
      </div>
    </>
  }
  function HistoryView() { return <><Header title="History" subtitle="Review every question you have solved." /><HistoryList /></> }
  function HistoryList() { return <div className="mt-8 flex flex-col gap-3">{history.length === 0 ? <p className="rounded-xl bg-muted p-5 text-sm text-muted-foreground">No saved questions yet. Solve one to see it here.</p> : history.map((item) => <button key={item.id} onClick={() => { setQuestion(item.question); setSubject(item.subject); setResult(item.result); go('Solve Question') }} className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary"><span className="text-xs font-semibold text-primary">{item.subject}</span><p className="mt-2 font-medium">{item.question}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p></button>)}</div> }
  function MistakesView() { return <><Header title="Mistake Notebook" subtitle="Review questions you got wrong and learn from them." /><section className="rounded-2xl border border-border bg-card p-6">{mistakes.length === 0 ? <p className="text-sm text-muted-foreground">No mistakes yet. Complete a quiz and your wrong answers will appear here.</p> : <div className="flex flex-col gap-4">{mistakes.map((item, index) => <div key={index} className="rounded-xl border border-border p-5"><p className="font-semibold">{item.question}</p><div className="mt-3 text-sm text-muted-foreground"><p><strong>Correct answer:</strong> {item.options[item.correctAnswer]}</p><p className="mt-2"><strong>Explanation:</strong> {item.explanation}</p></div></div>)}</div>}</section></> }

  function ProgressView() { return <><Header title="Progress" subtitle="Your progress is based on real activity in this browser." /><div className="grid gap-4 sm:grid-cols-3"><Stat label="Questions solved" value={String(history.length)} icon={Trophy} /><Stat label="Quiz attempts" value="0" icon={Target} /><Stat label="Study streak" value={history.length ? '1 day' : '0 days'} icon={Flame} /></div></> }
  function SettingsView() { return <><Header title="Settings" subtitle="Configure your StudyBuddy experience." /><section className="max-w-2xl rounded-2xl border border-border bg-card p-6"><h2 className="font-bold">Profile</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm">Name<input defaultValue="Arif Rahman" className="mt-2 w-full rounded-lg border border-input bg-background p-3" /></label><label className="text-sm">Education level<select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background p-3"><option>SSC</option><option>HSC</option><option>University</option></select></label></div><p className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">Development mode: authentication is not connected. Add Supabase variables to enable production auth.</p></section></> }
  const content = active === 'Dashboard' ? DashboardView() : active === 'Solve Question' ? SolveView() : active === 'AI Tutor' ? TutorView() : active === 'Quiz' ? QuizView() : active === 'Study Notes' ? NotesView() : active === 'History' ? HistoryView() : active === 'Mistakes' ? MistakesView() : active === 'Progress' ? ProgressView() : active === 'Settings' ? SettingsView() : DashboardView();


  return <main className="min-h-screen bg-background text-foreground"><div className="flex min-h-screen"><aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card px-5 py-6 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="mb-10 flex items-center justify-between px-2"><div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={18} /></div><p className="font-semibold">StudyBuddy</p></div><button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close menu"><X size={18} /></button></div><nav className="flex flex-col gap-1">{navItems.map(([label, Icon]) => <button key={label} onClick={() => go(label)} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium ${active === label ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}><Icon size={18} />{label}</button>)}</nav><div className="mt-auto rounded-2xl bg-muted p-4 text-xs text-muted-foreground">Development mode<br /><button onClick={() => go('Settings')} className="mt-2 font-semibold text-primary">Configure settings</button></div></aside>{sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" />}<section className="min-w-0 flex-1"><header className="flex h-20 items-center justify-between border-b border-border px-5 lg:px-10"><button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open menu"><Menu size={21} /></button><div className="hidden text-sm text-muted-foreground md:block">Study smarter, one question at a time.</div><button aria-label="Notifications"><Bell size={18} /></button></header><div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">{error && <div role="alert" className="mb-5 flex justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}<button onClick={() => setError('')}><X size={16} /></button></div>}{content}</div></section></div></main>
}
function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Flame }) { return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></div><p className="mt-5 text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div> }
function Answer({ label, value }: { label: string; value: string }) { return <div><p className="font-semibold text-primary">{label}</p><p className="mt-1 leading-6 text-muted-foreground">{value}</p></div> }
















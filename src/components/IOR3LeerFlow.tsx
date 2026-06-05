import { useState, useEffect } from 'react'
import { haalIOR3Theorie, evalueerIOR3Antwoord } from '../utils/claude'
import { updateVoortgang } from '../utils/auth'
import MarkdownContent from './MarkdownContent'
import type { IOR3Question } from '../data/ior3Questions'

type Stap = 'theorie' | 'vraag' | 'feedback'

function LaadSkeleton({ label }: { label: string }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm">{label}</p>
      </div>
      <div className="space-y-3">
        <div className="h-2.5 skeleton rounded-full w-full" />
        <div className="h-2.5 skeleton rounded-full w-5/6" />
        <div className="h-2.5 skeleton rounded-full w-4/6" />
        <div className="h-2.5 skeleton rounded-full w-full" />
        <div className="h-2.5 skeleton rounded-full w-3/4" />
      </div>
    </div>
  )
}

function ScoreBadge({ tekst }: { tekst: string }) {
  const match = tekst.match(/Score:\s*(\d+)\/10/i)
  const score = match ? parseInt(match[1]) : null
  if (score === null) return null
  const kleur = score >= 7 ? 'text-emerald-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400'
  return <div className={`text-5xl font-black ${kleur} mb-2`}>{score}/10</div>
}

interface Props {
  question: IOR3Question
  totalQuestions: number
  onVolgende: () => void
  isLaatste: boolean
}

export default function IOR3LeerFlow({ question, onVolgende, isLaatste }: Props) {
  const [stap, setStap] = useState<Stap>('theorie')
  const [theorie, setTheorie] = useState('')
  const [antwoord, setAntwoord] = useState('')
  const [feedback, setFeedback] = useState('')
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')

  const stapNummers: { key: Stap; label: string; icoon: string }[] = [
    { key: 'theorie', label: 'Theory', icoon: '📖' },
    { key: 'vraag', label: 'Question', icoon: '✏️' },
    { key: 'feedback', label: 'Feedback', icoon: '🎯' },
  ]

  useEffect(() => {
    laadTheorie()
  }, [question.id])

  async function laadTheorie() {
    setStap('theorie')
    setTheorie('')
    setAntwoord('')
    setFeedback('')
    setFout('')
    setLaden(true)
    try {
      await haalIOR3Theorie(
        question.question,
        question.keyPoints,
        (stuk) => { setTheorie(stuk); setLaden(false) }
      )
    } catch {
      setFout('Could not load theory. Check your API key.')
    } finally {
      setLaden(false)
    }
  }

  async function naarFeedback() {
    if (!antwoord.trim()) return
    setStap('feedback')
    setLaden(true)
    setFeedback('')
    try {
      await evalueerIOR3Antwoord(
        question.question,
        question.keyPoints,
        question.modelAnswer,
        antwoord,
        (stuk) => { setFeedback(stuk); setLaden(false) }
      )
      // Score opslaan
      const scoreMatch = feedback.match(/Score:\s*(\d+)\/10/i)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5
      updateVoortgang(question.id, score, 'ior3')
    } catch {
      setFout('Could not evaluate answer.')
    } finally {
      setLaden(false)
    }
  }

  // Score opslaan na feedback laden
  useEffect(() => {
    if (feedback) {
      const scoreMatch = feedback.match(/Score:\s*(\d+)\/10/i)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5
      updateVoortgang(question.id, score, 'ior3')
    }
  }, [feedback])

  return (
    <div className="space-y-5">
      {/* Stap indicator */}
      <div className="flex items-center gap-2 mb-2">
        {stapNummers.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && <div className="w-6 h-px bg-slate-700" />}
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              style={stap === s.key
                ? { backgroundColor: '#7c3aed25', color: '#7c3aed', border: '1px solid #7c3aed40' }
                : { color: '#475569', backgroundColor: 'rgba(30,41,59,0.5)' }}
            >
              <span>{s.icoon}</span> {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Fout */}
      {fout && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-4 py-3 text-sm">{fout}</div>
      )}

      {/* STAP 1: THEORIE */}
      {stap === 'theorie' && (
        <>
          {laden && <LaadSkeleton label="Loading theory from Claude..." />}
          {theorie && (
            <div className="glass rounded-3xl p-6 fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span>📖</span>
                <h3 className="text-white font-semibold">Background Theory</h3>
              </div>
              <MarkdownContent>{theorie}</MarkdownContent>
              <button
                onClick={() => setStap('vraag')}
                className="mt-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl px-6 py-3 transition-all hover:opacity-90 shadow-lg"
              >
                I'm ready for the question →
              </button>
            </div>
          )}
        </>
      )}

      {/* STAP 2: EXAMENVRAAG */}
      {stap === 'vraag' && (
        <div className="glass rounded-3xl p-6 fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span>✏️</span>
              <h3 className="text-white font-semibold">Exam Question</h3>
            </div>
            <button
              onClick={() => setStap('theorie')}
              className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 transition-all"
            >
              ← Back to theory
            </button>
          </div>

          {/* Vraag prominent tonen */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 mb-6">
            <p className="text-white font-medium leading-relaxed text-base">{question.question}</p>
          </div>

          {/* Key points als hint */}
          <div className="mb-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Key concepts to address:</p>
            <div className="flex flex-wrap gap-2">
              {question.keyPoints.map((kp, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-400 rounded-lg px-2.5 py-1">{kp}</span>
              ))}
            </div>
          </div>

          <textarea
            value={antwoord}
            onChange={e => setAntwoord(e.target.value)}
            rows={8}
            placeholder="Write your answer here..."
            className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none resize-none text-sm placeholder-slate-600 transition-all"
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = ''}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-slate-600 text-xs">{antwoord.length} characters</span>
            <button
              onClick={naarFeedback}
              disabled={!antwoord.trim()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-all hover:opacity-90 shadow-lg"
            >
              Submit answer →
            </button>
          </div>
        </div>
      )}

      {/* STAP 3: FEEDBACK */}
      {stap === 'feedback' && (
        <>
          {laden && <LaadSkeleton label="Evaluating your answer..." />}
          {feedback && (
            <div className="glass rounded-3xl p-6 fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span>🎯</span>
                <h3 className="text-white font-semibold">Feedback</h3>
              </div>
              <div className="text-center mb-5">
                <ScoreBadge tekst={feedback} />
              </div>
              <MarkdownContent>{feedback}</MarkdownContent>

              {/* Model antwoord */}
              <div className="mt-5 bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4">
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">📋 Model Answer</p>
                <MarkdownContent>{question.modelAnswer}</MarkdownContent>
              </div>

              <button
                onClick={onVolgende}
                className="mt-6 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl py-3.5 transition-all hover:opacity-90 shadow-lg"
              >
                {isLaatste ? '✓ Chapter completed!' : 'Next question →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

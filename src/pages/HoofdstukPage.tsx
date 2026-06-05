import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'
import { HOOFDSTUKKEN_IOR3 } from '../data/hoofdstukkenIOR3'
import { ior3Chapters } from '../data/ior3Questions'
import { haalUitleg, genereerVraag, evalueerAntwoord } from '../utils/claude'
import type { BronIndicator } from '../utils/claude'
import { getHuidigeGebruiker, getHuidigVak, updateVoortgang } from '../utils/auth'
import MarkdownContent from '../components/MarkdownContent'
import IOR3LeerFlow from '../components/IOR3LeerFlow'
import type { Concept } from '../types'

type Stap = 'uitleg' | 'vraag' | 'feedback'

function BronLabel(_: { bron: BronIndicator | null }) {
  return null
}

function LaadSkeleton({ label }: { label: string }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm">{label}</p>
      </div>
      <div className="space-y-3">
        <div className="h-2.5 skeleton rounded-full w-full" />
        <div className="h-2.5 skeleton rounded-full w-5/6" />
        <div className="h-2.5 skeleton rounded-full w-4/6" />
        <div className="h-2.5 skeleton rounded-full w-full mt-2" />
        <div className="h-2.5 skeleton rounded-full w-3/4" />
      </div>
    </div>
  )
}

function ScoreBadge({ feedback }: { feedback: string }) {
  const match = feedback.match(/Score:\s*(\d+)\/10/i)
  const score = match ? parseInt(match[1]) : null
  const kleur =
    score === null
      ? 'text-slate-400'
      : score >= 7
      ? 'text-emerald-400'
      : score >= 5
      ? 'text-yellow-400'
      : 'text-red-400'
  return score !== null ? (
    <div className={`text-4xl font-bold ${kleur} mb-2`}>{score}/10</div>
  ) : null
}

function FeedbackTekst({ tekst }: { tekst: string }) {
  const secties = [
    { label: 'Wat goed was:', kleur: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Wat ontbrak:', kleur: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    { label: 'Correct antwoord:', kleur: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  ]

  const scoreLijn = tekst.split('\n').find(r => /Score:/i.test(r))
  const heeftSecties = secties.some(s => tekst.includes(s.label))

  if (!heeftSecties) return <MarkdownContent>{tekst}</MarkdownContent>

  return (
    <div className="space-y-3">
      {scoreLijn && <p className="text-slate-200 font-semibold">{scoreLijn}</p>}
      {secties.map(({ label, kleur, bg }) => {
        const idx = tekst.indexOf(label)
        if (idx === -1) return null
        const rest = tekst.slice(idx + label.length)
        const volgende = secties.map(s => rest.indexOf(s.label)).filter(i => i > 0)
        const einde = volgende.length > 0 ? Math.min(...volgende) : rest.length
        const inhoud = rest.slice(0, einde).trim()
        return (
          <div key={label} className={`border rounded-xl p-4 ${bg}`}>
            <p className={`text-sm font-semibold mb-2 ${kleur}`}>{label}</p>
            <MarkdownContent>{inhoud}</MarkdownContent>
          </div>
        )
      })}
    </div>
  )
}

export default function HoofdstukPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vak = getHuidigVak()
  const alleHoofdstukken = vak === 'ior3' ? HOOFDSTUKKEN_IOR3 : HOOFDSTUKKEN
  const hoofdstuk = alleHoofdstukken.find(h => h.id === id)

  const [conceptIndex, setConceptIndex] = useState(0)
  const [stap, setStap] = useState<Stap>('uitleg')
  const [uitleg, setUitleg] = useState('')
  const [uitlegBron, setUitlegBron] = useState<BronIndicator | null>(null)
  const [vraag, setVraag] = useState('')
  const [vraagBron, setVraagBron] = useState<BronIndicator | null>(null)
  const [antwoord, setAntwoord] = useState('')
  const [feedback, setFeedback] = useState('')
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')

  const gebruiker = getHuidigeGebruiker()
  const huidigConcept: Concept | undefined = hoofdstuk?.concepten[conceptIndex]

  const laadUitleg = useCallback(async (concept: Concept) => {
    setLaden(true)
    setFout('')
    setUitleg('')
    setUitlegBron(null)
    try {
      const { tekst, bron } = await haalUitleg(
        concept.naam, vak, concept.modelantwoord,
        (stuk) => { setUitleg(stuk); setLaden(false) }
      )
      setUitleg(tekst)
      setUitlegBron(bron)
    } catch {
      setFout('Kon uitleg niet laden. Controleer je API-sleutel.')
    } finally {
      setLaden(false)
    }
  }, [])

  useEffect(() => {
    if (huidigConcept && stap === 'uitleg') laadUitleg(huidigConcept)
  }, [huidigConcept, stap, laadUitleg])

  async function naarVraag() {
    if (!huidigConcept) return
    setStap('vraag')
    setLaden(true)
    setFout('')
    setVraag('')
    setVraagBron(null)
    setAntwoord('')
    try {
      const { tekst, bron } = await genereerVraag(
        huidigConcept.naam, vak,
        (stuk) => { setVraag(stuk); setLaden(false) }
      )
      setVraag(tekst)
      setVraagBron(bron)
    } catch {
      setFout('Kon vraag niet genereren.')
    } finally {
      setLaden(false)
    }
  }

  async function naarFeedback() {
    if (!huidigConcept || !antwoord.trim()) return
    setStap('feedback')
    setLaden(true)
    setFout('')
    setFeedback('')
    try {
      const f = await evalueerAntwoord(huidigConcept.naam, vraag, antwoord, vak)
      setFeedback(f)
      const scoreMatch = f.match(/Score:\s*(\d+)\/10/i)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5
      updateVoortgang(huidigConcept.id, score, vak)
    } catch {
      setFout('Kon feedback niet ophalen.')
    } finally {
      setLaden(false)
    }
  }

  function volgendConcept() {
    if (!hoofdstuk) return
    if (conceptIndex + 1 >= hoofdstuk.concepten.length) {
      navigate('/dashboard')
      return
    }
    setConceptIndex(i => i + 1)
    setStap('uitleg')
    setUitleg('')
    setUitlegBron(null)
    setVraag('')
    setVraagBron(null)
    setAntwoord('')
    setFeedback('')
    setFout('')
  }

  const accent = vak === 'ior3' ? '#7c3aed' : '#3b82f6'
  const accentGradient = vak === 'ior3' ? 'from-violet-500 to-purple-600' : 'from-blue-500 to-cyan-500'

  if (!hoofdstuk) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <p className="text-white">Hoofdstuk niet gevonden.</p>
      </div>
    )
  }

  // ── IOR3: volledig andere leerflow ──────────────────────────────────────
  if (vak === 'ior3') {
    const ior3Chapter = ior3Chapters.find(c => c.id === id)
    if (!ior3Chapter) return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <p className="text-white">Chapter not found.</p>
      </div>
    )
    const questions = ior3Chapter.questions
    const ior3Pct = Math.round(((conceptIndex + 1) / questions.length) * 100)
    const huidigQuestion = questions[conceptIndex]

    function volgendeQuestion() {
      if (conceptIndex + 1 >= questions.length) navigate('/dashboard')
      else setConceptIndex(i => i + 1)
    }

    return (
      <div className="min-h-screen bg-mesh">
        <header className="glass-strong border-b border-white/5 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5">
              ← Dashboard
            </button>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">{ior3Chapter.title}</p>
              <p className="text-slate-500 text-xs">Question {conceptIndex + 1} of {questions.length}</p>
            </div>
            <span className="font-bold text-sm" style={{ color: accent }}>{ior3Pct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-0.5">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-0.5 transition-all duration-500" style={{ width: `${ior3Pct}%` }} />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold text-white mb-6 fade-in">
            Q{conceptIndex + 1}. {huidigQuestion.question.length > 80
              ? huidigQuestion.question.slice(0, 77) + '...'
              : huidigQuestion.question}
          </h2>
          <IOR3LeerFlow
            key={huidigQuestion.id}
            question={huidigQuestion}
            totalQuestions={questions.length}
            onVolgende={volgendeQuestion}
            isLaatste={conceptIndex + 1 >= questions.length}
          />

          {/* Question overview */}
          <div className="mt-5 glass rounded-2xl p-4">
            <p className="text-slate-500 text-xs mb-3">All questions</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const voortgangBron = gebruiker?.voortgangIOR3 ?? {}
                const gedaan = voortgangBron[q.id]?.voltooid
                return (
                  <div key={q.id} className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={i === conceptIndex
                      ? { backgroundColor: '#7c3aed', color: 'white' }
                      : gedaan
                      ? { backgroundColor: 'rgba(16,185,129,0.15)', color: '#34d399' }
                      : { backgroundColor: 'rgba(30,41,59,0.8)', color: '#64748b' }}>
                    Q{i + 1}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    )
  }
  // ── Einde IOR3 ──────────────────────────────────────────────────────────

  const voortgangPct = Math.round(
    ((conceptIndex + (stap === 'feedback' ? 1 : 0)) / hoofdstuk.concepten.length) * 100
  )

  const stapNummers: { key: Stap; label: string; icoon: string }[] = [
    { key: 'uitleg', label: 'Uitleg', icoon: '📖' },
    { key: 'vraag', label: 'Vraag', icoon: '✏️' },
    { key: 'feedback', label: 'Feedback', icoon: '🎯' },
  ]

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5"
          >
            ← Dashboard
          </button>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">{hoofdstuk.titel}</p>
            <p className="text-slate-500 text-xs">Concept {conceptIndex + 1} van {hoofdstuk.concepten.length}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-sm" style={{ color: accent }}>{voortgangPct}%</span>
          </div>
        </div>
        <div className="w-full bg-slate-800 h-0.5">
          <div className={`bg-gradient-to-r ${accentGradient} h-0.5 transition-all duration-500`} style={{ width: `${voortgangPct}%` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Stap-indicator */}
        <div className="mb-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            {stapNummers.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <div className="w-6 h-px bg-slate-700" />}
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  stap === s.key
                    ? 'text-white'
                    : 'text-slate-600 bg-slate-800/50'
                }`} style={stap === s.key ? { backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}40` } : {}}>
                  <span>{s.icoon}</span> {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{huidigConcept?.naam}</h2>
            {stap === 'vraag' && (
              <button onClick={() => setStap('uitleg')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-700 rounded-lg px-3 py-1.5">
                ← Terug naar uitleg
              </button>
            )}
          </div>
        </div>

        {/* Foutmelding */}
        {fout && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-4 py-3 text-sm mb-4">
            {fout}
          </div>
        )}

        {/* Laad-skeleton */}
        {laden && stap === 'uitleg' && <LaadSkeleton label="Uitleg ophalen bij Claude..." />}
        {laden && stap === 'vraag' && <LaadSkeleton label="Examenvraag genereren..." />}
        {laden && stap === 'feedback' && <LaadSkeleton label="Antwoord evalueren..." />}

        {/* STAP 1: UITLEG */}
        {stap === 'uitleg' && uitleg && (
          <div className="glass rounded-3xl p-6 fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📖</span>
              <h3 className="text-white font-semibold">Uitleg</h3>
              <BronLabel bron={uitlegBron} />
            </div>
            <MarkdownContent>{uitleg}</MarkdownContent>
            <button
              onClick={naarVraag}
              className={`mt-6 bg-gradient-to-r ${accentGradient} text-white font-semibold rounded-xl px-6 py-3 transition-all hover:opacity-90 shadow-lg`}
            >
              Ik snap het →
            </button>
          </div>
        )}

        {/* STAP 2: VRAAG */}
        {stap === 'vraag' && vraag && (
          <div className="glass rounded-3xl p-6 fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✏️</span>
              <h3 className="text-white font-semibold">Examenvraag</h3>
              <BronLabel bron={vraagBron} />
            </div>
            <div className="mb-6">
              <MarkdownContent className="text-slate-200 font-medium">{vraag}</MarkdownContent>
            </div>
            <textarea
              value={antwoord}
              onChange={e => setAntwoord(e.target.value)}
              rows={6}
              placeholder="Typ hier je antwoord..."
              className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none transition-all resize-none text-sm placeholder-slate-600"
              style={{ ['--tw-ring-color' as string]: accent }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = ''}
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-slate-600 text-xs">{antwoord.length} tekens</span>
              <button
                onClick={naarFeedback}
                disabled={!antwoord.trim()}
                className={`bg-gradient-to-r ${accentGradient} disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-all hover:opacity-90 shadow-lg`}
              >
                Indienen →
              </button>
            </div>
          </div>
        )}

        {/* STAP 3: FEEDBACK */}
        {!laden && stap === 'feedback' && feedback && (
          <div className="glass rounded-3xl p-6 fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎯</span>
              <h3 className="text-white font-semibold">Feedback</h3>
            </div>
            <div className="mb-4 text-center">
              <ScoreBadge feedback={feedback} />
            </div>
            <FeedbackTekst tekst={feedback} />
            <div className="mt-6">
              <button
                onClick={volgendConcept}
                className={`w-full bg-gradient-to-r ${accentGradient} text-white font-semibold rounded-xl py-3.5 transition-all hover:opacity-90 shadow-lg`}
              >
                {conceptIndex + 1 >= hoofdstuk.concepten.length ? '✓ Hoofdstuk voltooid!' : 'Volgend concept →'}
              </button>
            </div>
          </div>
        )}

        {/* Concept-overzicht */}
        <div className="mt-5 glass rounded-2xl p-4">
          <p className="text-slate-400 text-xs mb-3">Alle concepten</p>
          <div className="flex flex-wrap gap-2">
            {hoofdstuk.concepten.map((c, i) => {
              const gedaan = gebruiker?.voortgang[c.id]?.voltooid
              return (
                <div
                  key={c.id}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    i === conceptIndex
                      ? 'bg-[#3b82f6] text-white'
                      : gedaan
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {c.naam}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

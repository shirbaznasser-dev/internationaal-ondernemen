import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'
import { haalUitleg, genereerVraag, evalueerAntwoord } from '../utils/claude'
import type { BronIndicator } from '../utils/claude'
import { getHuidigeGebruiker, updateVoortgang } from '../utils/auth'
import MarkdownContent from '../components/MarkdownContent'
import type { Concept } from '../types'

type Stap = 'uitleg' | 'vraag' | 'feedback'

function BronLabel({ bron }: { bron: BronIndicator | null }) {
  if (!bron) return null
  return bron === 'cache' ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
      ⚡ Uit cache
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-1">
      🤖 Nieuw gegenereerd
    </span>
  )
}

function LaadSkeleton({ label }: { label: string }) {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
          <div className="absolute inset-0 rounded-full border-2 border-[#3b82f6] border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-400 text-sm">{label}</p>
      </div>
      {/* Skeleton regels */}
      <div className="space-y-3 mt-2">
        <div className="h-3 bg-slate-700 rounded-full animate-pulse w-full" />
        <div className="h-3 bg-slate-700 rounded-full animate-pulse w-5/6" />
        <div className="h-3 bg-slate-700 rounded-full animate-pulse w-4/6" />
        <div className="h-3 bg-slate-700 rounded-full animate-pulse w-full mt-4" />
        <div className="h-3 bg-slate-700 rounded-full animate-pulse w-3/4" />
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
  const hoofdstuk = HOOFDSTUKKEN.find(h => h.id === id)

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
      const { tekst, bron } = await haalUitleg(concept.naam)
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
      const { tekst, bron } = await genereerVraag(huidigConcept.naam)
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
      const f = await evalueerAntwoord(huidigConcept.naam, vraag, antwoord)
      setFeedback(f)
      const scoreMatch = f.match(/Score:\s*(\d+)\/10/i)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5
      updateVoortgang(huidigConcept.id, score)
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

  if (!hoofdstuk) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-white">Hoofdstuk niet gevonden.</p>
      </div>
    )
  }

  const voortgangPct = Math.round(
    ((conceptIndex + (stap === 'feedback' ? 1 : 0)) / hoofdstuk.concepten.length) * 100
  )

  const stapNummers: { key: Stap; label: string }[] = [
    { key: 'uitleg', label: 'Uitleg' },
    { key: 'vraag', label: 'Vraag' },
    { key: 'feedback', label: 'Feedback' },
  ]

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            ← Dashboard
          </button>
          <div className="text-center">
            <p className="text-white font-semibold">{hoofdstuk.titel}</p>
            <p className="text-slate-400 text-xs">
              Concept {conceptIndex + 1} van {hoofdstuk.concepten.length}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[#3b82f6] font-bold">{voortgangPct}%</span>
          </div>
        </div>
        <div className="w-full bg-slate-700 h-1">
          <div
            className="bg-[#3b82f6] h-1 transition-all duration-500"
            style={{ width: `${voortgangPct}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Stap-indicator + conceptnaam */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {stapNummers.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-slate-600" />}
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${
                    stap === s.key ? 'text-[#3b82f6]' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      stap === s.key ? 'bg-[#3b82f6] text-white' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{huidigConcept?.naam}</h2>
            {stap === 'vraag' && (
              <button
                onClick={() => setStap('uitleg')}
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                ← Terug naar uitleg
              </button>
            )}
          </div>
        </div>

        {/* Foutmelding */}
        {fout && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
            {fout}
          </div>
        )}

        {/* Laad-skeleton */}
        {laden && stap === 'uitleg' && <LaadSkeleton label="Uitleg ophalen bij Claude..." />}
        {laden && stap === 'vraag' && <LaadSkeleton label="Examenvraag genereren..." />}
        {laden && stap === 'feedback' && <LaadSkeleton label="Antwoord evalueren..." />}

        {/* STAP 1: UITLEG */}
        {!laden && stap === 'uitleg' && uitleg && (
          <div className="bg-[#1e293b] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h3 className="text-white font-semibold">Uitleg</h3>
              </div>
              <BronLabel bron={uitlegBron} />
            </div>
            <MarkdownContent>{uitleg}</MarkdownContent>
            <button
              onClick={naarVraag}
              className="mt-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl px-6 py-3 transition-colors"
            >
              Ik snap het →
            </button>
          </div>
        )}

        {/* STAP 2: VRAAG */}
        {!laden && stap === 'vraag' && vraag && (
          <div className="bg-[#1e293b] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">✏️</span>
                <h3 className="text-white font-semibold">Examenvraag</h3>
              </div>
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
              className="w-full bg-[#0f172a] border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#3b82f6] transition-colors resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-slate-500 text-xs">{antwoord.length} tekens</span>
              <button
                onClick={naarFeedback}
                disabled={!antwoord.trim()}
                className="bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-colors"
              >
                Indienen →
              </button>
            </div>
          </div>
        )}

        {/* STAP 3: FEEDBACK */}
        {!laden && stap === 'feedback' && feedback && (
          <div className="bg-[#1e293b] rounded-2xl p-6">
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
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl py-3 transition-colors"
              >
                {conceptIndex + 1 >= hoofdstuk.concepten.length
                  ? '✓ Hoofdstuk voltooid!'
                  : 'Volgend concept →'}
              </button>
            </div>
          </div>
        )}

        {/* Concept-overzicht */}
        <div className="mt-6 bg-[#1e293b] rounded-2xl p-4">
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

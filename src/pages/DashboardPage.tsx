import { useNavigate } from 'react-router-dom'
import { getHuidigeGebruiker, getHuidigVak, logout } from '../utils/auth'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'
import { HOOFDSTUKKEN_IOR3 } from '../data/hoofdstukkenIOR3'
import type { Hoofdstuk } from '../types'

const ICONEN_IOR2 = ['📚', '🛡️', '🌍', '💰', '📝']
const ICONEN_IOR3 = ['🏭', '🔄', '💡', '🗺️', '👥']

const KLEUREN_IOR2 = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800',
  'from-orange-600 to-orange-800',
  'from-rose-600 to-rose-800',
]
const KLEUREN_IOR3 = [
  'from-violet-600 to-violet-800',
  'from-teal-600 to-teal-800',
  'from-amber-600 to-amber-800',
  'from-red-600 to-red-800',
  'from-cyan-600 to-cyan-800',
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const gebruiker = getHuidigeGebruiker()
  const vak = getHuidigVak()

  const isIOR3 = vak === 'ior3'
  const hoofdstukken: Hoofdstuk[] = isIOR3 ? HOOFDSTUKKEN_IOR3 : HOOFDSTUKKEN
  const ICONEN = isIOR3 ? ICONEN_IOR3 : ICONEN_IOR2
  const KLEUREN = isIOR3 ? KLEUREN_IOR3 : KLEUREN_IOR2
  const accentKleur = isIOR3 ? '#7c3aed' : '#3b82f6'
  const voortgangData = isIOR3 ? (gebruiker?.voortgangIOR3 ?? {}) : (gebruiker?.voortgang ?? {})

  function handleLogout() {
    logout()
    navigate('/')
  }

  function berekenVoortgang(hoofdstuk: Hoofdstuk): { voltooid: number; totaal: number; gemScore: number } {
    let voltooid = 0
    let totaalScore = 0
    for (const c of hoofdstuk.concepten) {
      const v = voortgangData[c.id]
      if (v?.voltooid) {
        voltooid++
        totaalScore += v.score
      }
    }
    return {
      voltooid,
      totaal: hoofdstuk.concepten.length,
      gemScore: voltooid > 0 ? Math.round(totaalScore / voltooid) : 0,
    }
  }

  const totaalVoltooid = hoofdstukken.reduce((acc, h) => acc + berekenVoortgang(h).voltooid, 0)
  const totaalConcepten = hoofdstukken.reduce((acc, h) => acc + h.concepten.length, 0)
  const totaalPct = totaalConcepten > 0 ? Math.round((totaalVoltooid / totaalConcepten) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-default select-none">
            <span className="text-2xl">{isIOR3 ? '🚀' : '🌍'}</span>
            <div>
              <h1 className="text-white font-bold">IOR AI Leerapp</h1>
              <p className="text-slate-400 text-xs">
                {isIOR3 ? 'International Entrepreneurship III · KdG' : 'Internationaal Ondernemen · KdG'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/vakkeuze')}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Wissel vak
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 text-sm">{gebruiker?.naam}</span>
            {gebruiker?.isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm hover:underline"
                style={{ color: accentKleur }}
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Vak badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: `${accentKleur}20`, color: accentKleur }}>
          {vak.toUpperCase()} — {isIOR3 ? 'International Entrepreneurship III' : 'Internationaal Ondernemen'}
        </div>

        {/* Voortgang samenvatting */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-8 flex items-center justify-between cursor-default select-none">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Jouw voortgang</h2>
            <p className="text-slate-400">{totaalVoltooid} van {totaalConcepten} concepten voltooid</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold" style={{ color: accentKleur }}>{totaalPct}%</div>
            <p className="text-slate-400 text-sm">totaal</p>
          </div>
        </div>

        {/* Hoofdstuk kaarten */}
        <h2 className="text-3xl font-bold text-white mb-6">Hoofdstukken</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hoofdstukken.map((h, i) => {
            const { voltooid, totaal, gemScore } = berekenVoortgang(h)
            const pct = totaal > 0 ? Math.round((voltooid / totaal) * 100) : 0

            return (
              <button
                key={h.id}
                onClick={() => navigate(`/hoofdstuk/${h.id}`)}
                className="bg-[#1e293b] rounded-2xl p-8 text-left transition-all group"
                style={{ outline: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentKleur}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${KLEUREN[i]} text-3xl shrink-0`}>
                    {ICONEN[i]}
                  </div>
                  <p className="text-white text-2xl font-bold">
                    Hoofdstuk {i + 1}
                  </p>
                </div>
                <h3 className="text-white font-bold text-xl mb-2 transition-colors group-hover:opacity-80">
                  {h.titel}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{h.beschrijving}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>{voltooid}/{totaal} concepten</span>
                  {voltooid > 0 && <span>gem. {gemScore}/10</span>}
                  <span className="font-bold text-white text-sm">{pct}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: accentKleur }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}

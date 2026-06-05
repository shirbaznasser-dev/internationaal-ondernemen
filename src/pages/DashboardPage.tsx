import { useNavigate } from 'react-router-dom'
import { getHuidigeGebruiker, getHuidigVak, logout } from '../utils/auth'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'
import { HOOFDSTUKKEN_IOR3 } from '../data/hoofdstukkenIOR3'
import type { Hoofdstuk } from '../types'

const ICONEN_IOR2 = ['📚', '🛡️', '🌍', '💰', '📝']
const ICONEN_IOR3 = ['🏭', '🔄', '💡', '🗺️', '👥']
const KLEUREN_IOR2 = ['from-blue-500 to-cyan-500','from-purple-500 to-pink-500','from-emerald-500 to-teal-500','from-orange-500 to-amber-500','from-rose-500 to-pink-500']
const KLEUREN_IOR3 = ['from-violet-500 to-purple-600','from-teal-500 to-cyan-500','from-amber-500 to-orange-500','from-red-500 to-rose-500','from-cyan-500 to-blue-500']

export default function DashboardPage() {
  const navigate = useNavigate()
  const gebruiker = getHuidigeGebruiker()
  const vak = getHuidigVak()
  const isIOR3 = vak === 'ior3'
  const hoofdstukken: Hoofdstuk[] = isIOR3 ? HOOFDSTUKKEN_IOR3 : HOOFDSTUKKEN
  const ICONEN = isIOR3 ? ICONEN_IOR3 : ICONEN_IOR2
  const KLEUREN = isIOR3 ? KLEUREN_IOR3 : KLEUREN_IOR2
  const accent = isIOR3 ? '#7c3aed' : '#3b82f6'
  const accentGradient = isIOR3 ? 'from-violet-500 to-purple-600' : 'from-blue-500 to-cyan-500'
  const voortgangData = isIOR3 ? (gebruiker?.voortgangIOR3 ?? {}) : (gebruiker?.voortgang ?? {})

  function berekenVoortgang(h: Hoofdstuk) {
    let voltooid = 0, totaalScore = 0
    for (const c of h.concepten) {
      const v = voortgangData[c.id]
      if (v?.voltooid) { voltooid++; totaalScore += v.score }
    }
    return { voltooid, totaal: h.concepten.length, gemScore: voltooid > 0 ? Math.round(totaalScore / voltooid) : 0 }
  }

  const totaalVoltooid = hoofdstukken.reduce((acc, h) => acc + berekenVoortgang(h).voltooid, 0)
  const totaalConcepten = hoofdstukken.reduce((acc, h) => acc + h.concepten.length, 0)
  const totaalPct = totaalConcepten > 0 ? Math.round((totaalVoltooid / totaalConcepten) * 100) : 0

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-default select-none">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentGradient} flex items-center justify-center text-lg`}>
              {isIOR3 ? '🚀' : '🌍'}
            </div>
            <div>
              <span className="text-white font-bold text-sm">IOR AI Leerapp</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${accent}20`, color: accent }}>
                {vak.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/vakkeuze')} className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-all">
              ⇄ Wissel vak
            </button>
            <span className="text-slate-500 text-sm cursor-default select-none">{gebruiker?.naam}</span>
            {gebruiker?.isAdmin && (
              <button onClick={() => navigate('/admin')} className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all" style={{ backgroundColor: `${accent}20`, color: accent }}>
                Admin
              </button>
            )}
            <button onClick={() => { logout(); navigate('/') }} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Voortgang banner */}
        <div className="glass rounded-3xl p-6 mb-8 flex items-center justify-between cursor-default select-none relative overflow-hidden fade-in">
          <div className={`absolute inset-0 bg-gradient-to-r ${accentGradient} opacity-5`} />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>Jouw voortgang</p>
            <h2 className="text-2xl font-bold text-white">{totaalVoltooid} van {totaalConcepten} concepten voltooid</h2>
            <div className="mt-3 w-64 bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full bg-gradient-to-r ${accentGradient} transition-all`} style={{ width: `${totaalPct}%` }} />
            </div>
          </div>
          <div className="relative text-right">
            <div className="text-5xl font-black tracking-tight" style={{ color: accent }}>{totaalPct}%</div>
            <p className="text-slate-500 text-sm mt-1">totaal</p>
          </div>
        </div>

        {/* Hoofdstukken */}
        <h2 className="text-2xl font-bold text-white mb-5">Hoofdstukken</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hoofdstukken.map((h, i) => {
            const { voltooid, totaal, gemScore } = berekenVoortgang(h)
            const pct = totaal > 0 ? Math.round((voltooid / totaal) * 100) : 0
            return (
              <button
                key={h.id}
                onClick={() => navigate(`/hoofdstuk/${h.id}`)}
                className="glass rounded-3xl p-7 text-left transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${accent}20, inset 0 0 0 1px ${accent}25`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br ${KLEUREN[i]} opacity-5 blur-3xl -translate-y-10 translate-x-10`} />

                <div className="flex items-center gap-4 mb-4 relative">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${KLEUREN[i]} text-2xl shrink-0 shadow-lg`}>
                    {ICONEN[i]}
                  </div>
                  <p className="text-slate-300 text-xl font-bold">Hoofdstuk {i + 1}</p>
                </div>

                <h3 className="text-white font-bold text-lg mb-1.5 relative">{h.titel}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5 relative">{h.beschrijving}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{voltooid}/{totaal} concepten</span>
                  {voltooid > 0 && <span className="text-emerald-400 font-medium">gem. {gemScore}/10</span>}
                  <span className="font-bold text-white">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${KLEUREN[i]} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}

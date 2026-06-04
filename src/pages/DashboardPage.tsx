import { useNavigate } from 'react-router-dom'
import { getHuidigeGebruiker, logout } from '../utils/auth'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'

const ICONEN = ['📚', '🛡️', '🌍', '💰']
const KLEUREN = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800',
  'from-orange-600 to-orange-800',
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const gebruiker = getHuidigeGebruiker()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function berekenVoortgang(hoofdstukId: string): { voltooid: number; totaal: number; gemScore: number } {
    const h = HOOFDSTUKKEN.find(h => h.id === hoofdstukId)
    if (!h) return { voltooid: 0, totaal: 0, gemScore: 0 }
    const voortgang = gebruiker?.voortgang ?? {}
    let voltooid = 0
    let totaalScore = 0
    for (const c of h.concepten) {
      const v = voortgang[c.id]
      if (v?.voltooid) {
        voltooid++
        totaalScore += v.score
      }
    }
    return {
      voltooid,
      totaal: h.concepten.length,
      gemScore: voltooid > 0 ? Math.round(totaalScore / voltooid) : 0,
    }
  }

  const totaalVoltooid = HOOFDSTUKKEN.reduce((acc, h) => {
    const { voltooid } = berekenVoortgang(h.id)
    return acc + voltooid
  }, 0)

  const totaalConcepten = HOOFDSTUKKEN.reduce((acc, h) => acc + h.concepten.length, 0)

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-default select-none">
            <span className="text-2xl">🌍</span>
            <div>
              <h1 className="text-white font-bold">IOR2 Leerapp</h1>
              <p className="text-slate-400 text-xs">Internationaal Ondernemen · KdG</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">Welkom, {gebruiker?.naam}</span>
            {gebruiker?.isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-[#3b82f6] hover:underline"
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
        {/* Voortgang samenvatting */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-8 flex items-center justify-between cursor-default select-none">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Jouw voortgang</h2>
            <p className="text-slate-400">
              {totaalVoltooid} van {totaalConcepten} concepten voltooid
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#3b82f6]">
              {totaalConcepten > 0 ? Math.round((totaalVoltooid / totaalConcepten) * 100) : 0}%
            </div>
            <p className="text-slate-400 text-sm">totaal</p>
          </div>
        </div>

        {/* Hoofdstuk kaarten */}
        <h2 className="text-3xl font-bold text-white mb-6">Hoofdstukken</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HOOFDSTUKKEN.map((h, i) => {
            const { voltooid, totaal, gemScore } = berekenVoortgang(h.id)
            const pct = totaal > 0 ? Math.round((voltooid / totaal) * 100) : 0

            return (
              <button
                key={h.id}
                onClick={() => navigate(`/hoofdstuk/${h.id}`)}
                className="bg-[#1e293b] rounded-2xl p-8 text-left hover:ring-2 hover:ring-[#3b82f6] transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${KLEUREN[i]} mb-5 text-3xl`}>
                  {ICONEN[i]}
                </div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
                  Hoofdstuk {i + 1}
                </p>
                <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#3b82f6] transition-colors">
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
                    className="bg-[#3b82f6] h-3 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
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

import { useNavigate } from 'react-router-dom'
import { getAlleGebruikers, logout } from '../utils/auth'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'

export default function AdminPage() {
  const navigate = useNavigate()
  const gebruikers = getAlleGebruikers().filter(g => !g.isAdmin)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function berekenHoofdstukStats(voortgang: Record<string, { voltooid: boolean; score: number }>, hoofdstukId: string) {
    const h = HOOFDSTUKKEN.find(h => h.id === hoofdstukId)
    if (!h) return { pct: 0, gemScore: 0 }
    let voltooid = 0
    let totaalScore = 0
    for (const c of h.concepten) {
      const v = voortgang[c.id]
      if (v?.voltooid) {
        voltooid++
        totaalScore += v.score
      }
    }
    const pct = Math.round((voltooid / h.concepten.length) * 100)
    const gemScore = voltooid > 0 ? Math.round(totaalScore / voltooid) : 0
    return { pct, gemScore }
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <h1 className="text-white font-bold">IOR2 Admin</h1>
              <p className="text-slate-400 text-xs">Internationaal Ondernemen · KdG</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Studentenoverzicht
            <span className="ml-3 text-lg font-normal text-slate-400">
              ({gebruikers.length} studenten)
            </span>
          </h2>
        </div>

        {gebruikers.length === 0 ? (
          <div className="bg-[#1e293b] rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">👤</p>
            <p className="text-slate-400">Nog geen studenten geregistreerd.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gebruikers.map(g => {
              const totaalConcepten = HOOFDSTUKKEN.reduce((acc, h) => acc + h.concepten.length, 0)
              const totaalVoltooid = Object.values(g.voortgang).filter(v => v.voltooid).length
              const totaalPct = Math.round((totaalVoltooid / totaalConcepten) * 100)

              return (
                <div key={g.email} className="bg-[#1e293b] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{g.naam}</h3>
                      <p className="text-slate-400 text-sm">{g.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#3b82f6]">{totaalPct}%</div>
                      <p className="text-slate-400 text-xs">{totaalVoltooid}/{totaalConcepten} concepten</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {HOOFDSTUKKEN.map(h => {
                      const { pct, gemScore } = berekenHoofdstukStats(g.voortgang, h.id)
                      return (
                        <div key={h.id} className="bg-[#0f172a] rounded-xl p-3">
                          <p className="text-slate-300 text-xs font-medium mb-2 truncate">{h.titel}</p>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-bold text-sm">{pct}%</span>
                            {gemScore > 0 && (
                              <span className={`text-xs font-semibold ${
                                gemScore >= 7 ? 'text-emerald-400' : gemScore >= 5 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {gemScore}/10
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div
                              className="bg-[#3b82f6] h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

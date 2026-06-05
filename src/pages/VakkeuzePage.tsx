import { useNavigate } from 'react-router-dom'
import { getHuidigeGebruiker, setHuidigVak, logout } from '../utils/auth'
import { HOOFDSTUKKEN } from '../data/hoofdstukken'
import { HOOFDSTUKKEN_IOR3 } from '../data/hoofdstukkenIOR3'
import type { VakId } from '../types'

function berekenVoortgangVak(
  voortgang: Record<string, { voltooid: boolean; score: number }>,
  hoofdstukken: typeof HOOFDSTUKKEN
): { voltooid: number; totaal: number } {
  const totaal = hoofdstukken.reduce((acc, h) => acc + h.concepten.length, 0)
  const voltooid = Object.values(voortgang).filter(v => v.voltooid).length
  return { voltooid, totaal }
}

export default function VakkeuzePage() {
  const navigate = useNavigate()
  const gebruiker = getHuidigeGebruiker()

  function kiesVak(vak: VakId) {
    setHuidigVak(vak)
    navigate('/dashboard')
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const ior2Stats = berekenVoortgangVak(gebruiker?.voortgang ?? {}, HOOFDSTUKKEN)
  const ior3Stats = berekenVoortgangVak(gebruiker?.voortgangIOR3 ?? {}, HOOFDSTUKKEN_IOR3)
  const ior2Pct = ior2Stats.totaal > 0 ? Math.round((ior2Stats.voltooid / ior2Stats.totaal) * 100) : 0
  const ior3Pct = ior3Stats.totaal > 0 ? Math.round((ior3Stats.voltooid / ior3Stats.totaal) * 100) : 0

  const vakken: {
    id: VakId; code: string; naam: string; beschrijving: string
    pct: number; voltooid: number; totaal: number
    gradient: string; accentKleur: string; icoon: string; glowClass: string
  }[] = [
    {
      id: 'ior2', code: 'IOR2', naam: 'Internationaal Ondernemen',
      beschrijving: 'Handelstheorieën, Handelspolitiek, Globalisering & Financiële Markten',
      pct: ior2Pct, voltooid: ior2Stats.voltooid, totaal: ior2Stats.totaal,
      gradient: 'from-blue-500 to-cyan-500', accentKleur: '#3b82f6', icoon: '🌍', glowClass: 'glow-blue',
    },
    {
      id: 'ior3', code: 'IOR3', naam: 'International Entrepreneurship III',
      beschrijving: 'Procurement, Kaizen/TPS, Intellectual Property, Geopolitiek & HR',
      pct: ior3Pct, voltooid: ior3Stats.voltooid, totaal: ior3Stats.totaal,
      gradient: 'from-violet-500 to-purple-600', accentKleur: '#7c3aed', icoon: '🚀', glowClass: 'glow-violet',
    },
  ]

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-default select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg">🎓</div>
            <span className="text-white font-bold">IOR AI Leerapp</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm cursor-default select-none">{gebruiker?.naam}</span>
            <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5">
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-12 fade-in">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Welkom, {gebruiker?.naam}</p>
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Kies je vak</h2>
          <p className="text-slate-400 text-lg">Selecteer het vak waarmee je wil studeren</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl fade-in">
          {vakken.map(vak => (
            <button
              key={vak.id}
              onClick={() => kiesVak(vak.id)}
              className="glass rounded-3xl p-8 text-left transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
              style={{ '--hover-glow': vak.accentKleur } as React.CSSProperties}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${vak.accentKleur}25, inset 0 0 0 1px ${vak.accentKleur}30`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              {/* Subtle bg glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br ${vak.gradient} opacity-5 blur-3xl -translate-y-12 translate-x-12`} />

              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${vak.gradient} text-3xl mb-5 shadow-lg`}>
                {vak.icoon}
              </div>

              <div className="mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: vak.accentKleur }}>
                  {vak.code}
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{vak.naam}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{vak.beschrijving}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>{vak.voltooid}/{vak.totaal} concepten</span>
                <span className="font-bold text-white">{vak.pct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${vak.gradient} transition-all`} style={{ width: `${vak.pct}%` }} />
              </div>

              <div className="mt-5 text-sm font-semibold flex items-center gap-2 transition-all group-hover:gap-3" style={{ color: vak.accentKleur }}>
                Starten met {vak.code} <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

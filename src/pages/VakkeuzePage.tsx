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
    id: VakId
    code: string
    naam: string
    beschrijving: string
    pct: number
    voltooid: number
    totaal: number
    kleur: string
    accentKleur: string
    icoon: string
  }[] = [
    {
      id: 'ior2',
      code: 'IOR2',
      naam: 'Internationaal Ondernemen',
      beschrijving: 'Handelstheorieën, Handelspolitiek, Globalisering & Financiële Markten',
      pct: ior2Pct,
      voltooid: ior2Stats.voltooid,
      totaal: ior2Stats.totaal,
      kleur: 'from-blue-600 to-blue-800',
      accentKleur: '#3b82f6',
      icoon: '🌍',
    },
    {
      id: 'ior3',
      code: 'IOR3',
      naam: 'International Entrepreneurship III',
      beschrijving: 'Procurement, Kaizen, Intellectual Property, Geopolitiek & HR',
      pct: ior3Pct,
      voltooid: ior3Stats.voltooid,
      totaal: ior3Stats.totaal,
      kleur: 'from-violet-600 to-violet-800',
      accentKleur: '#7c3aed',
      icoon: '🚀',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-default select-none">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-white font-bold">KdG Leerapp</h1>
              <p className="text-slate-400 text-xs">Karel de Grote Hogeschool</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">Welkom, {gebruiker?.naam}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">Kies je vak</h2>
          <p className="text-slate-400 text-lg">Selecteer het vak waarmee je wil studeren</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {vakken.map(vak => (
            <button
              key={vak.id}
              onClick={() => kiesVak(vak.id)}
              className="bg-[#1e293b] rounded-2xl p-8 text-left hover:ring-2 transition-all group"
              style={{ ['--tw-ring-color' as string]: vak.accentKleur }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${vak.kleur} text-3xl mb-5`}>
                {vak.icoon}
              </div>

              <div className="mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: vak.accentKleur }}
                >
                  {vak.code}
                </span>
              </div>
              <h3
                className="text-white font-bold text-xl mb-2 transition-colors"
                style={{ ['--tw-text-opacity' as string]: '1' }}
              >
                {vak.naam}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {vak.beschrijving}
              </p>

              {/* Voortgang */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{vak.voltooid}/{vak.totaal} concepten voltooid</span>
                <span className="font-bold text-white text-sm">{vak.pct}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{ width: `${vak.pct}%`, backgroundColor: vak.accentKleur }}
                />
              </div>

              <div
                className="mt-5 text-sm font-semibold flex items-center gap-2 transition-colors"
                style={{ color: vak.accentKleur }}
              >
                Ga naar {vak.code} →
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

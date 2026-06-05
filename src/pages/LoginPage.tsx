import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../utils/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [laden, setLaden] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFout('')
    setLaden(true)
    const g = login(email, wachtwoord)
    setLaden(false)
    if (!g) { setFout('Ongeldig e-mailadres of wachtwoord.'); return }
    navigate(g.isAdmin ? '/admin' : '/vakkeuze')
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 mb-5 shadow-lg glow-blue">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">IOR AI Leerapp</h1>
          <p className="text-slate-400 mt-2 text-sm">Karel de Grote Hogeschool · Antwerpen</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Welkom terug</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-600"
                placeholder="naam@student.kdg.be"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={wachtwoord}
                onChange={e => setWachtwoord(e.target.value)}
                required
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>

            {fout && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                {fout}
              </div>
            )}

            <button
              type="submit"
              disabled={laden}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-violet-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3.5 transition-all shadow-lg shadow-blue-500/20 mt-2"
            >
              {laden ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Inloggen...
                </span>
              ) : 'Inloggen →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-sm">
              Nog geen account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Registreer hier
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

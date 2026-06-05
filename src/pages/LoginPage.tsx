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
    if (!g) {
      setFout('Ongeldig e-mailadres of wachtwoord.')
      return
    }
    navigate(g.isAdmin ? '/admin' : '/vakkeuze')
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3b82f6] mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h1 className="text-3xl font-bold text-white">IOR2 Leerapp</h1>
          <p className="text-slate-400 mt-2">Internationaal Ondernemen · KdG</p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Inloggen</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#0f172a] border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#3b82f6] transition-colors"
                placeholder="naam@student.kdg.be"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={wachtwoord}
                onChange={e => setWachtwoord(e.target.value)}
                required
                className="w-full bg-[#0f172a] border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#3b82f6] transition-colors"
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
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              {laden ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Nog geen account?{' '}
            <Link to="/register" className="text-[#3b82f6] hover:underline">
              Registreer hier
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

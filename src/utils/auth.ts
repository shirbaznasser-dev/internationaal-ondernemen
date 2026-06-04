import type { Gebruiker } from '../types'

const STORAGE_KEY = 'ior2_gebruiker'
const GEBRUIKERS_KEY = 'ior2_gebruikers'

export function getHuidigeGebruiker(): Gebruiker | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function setHuidigeGebruiker(g: Gebruiker) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(g))
  slaGebruikerOp(g)
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

function slaGebruikerOp(g: Gebruiker) {
  const lijst = getAlleGebruikers()
  const idx = lijst.findIndex(u => u.email === g.email)
  if (idx >= 0) lijst[idx] = g
  else lijst.push(g)
  localStorage.setItem(GEBRUIKERS_KEY, JSON.stringify(lijst))
}

export function getAlleGebruikers(): Gebruiker[] {
  const raw = localStorage.getItem(GEBRUIKERS_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export function login(email: string, wachtwoord: string): Gebruiker | null {
  if (email === 'admin@ior2.be' && wachtwoord === 'admin2026') {
    const admin: Gebruiker = { email, naam: 'Admin', isAdmin: true, voortgang: {} }
    setHuidigeGebruiker(admin)
    return admin
  }
  const lijst = getAlleGebruikers()
  const gevonden = lijst.find(u => u.email === email)
  if (!gevonden) return null
  const opgeslagen = localStorage.getItem(`ior2_pw_${email}`)
  if (opgeslagen !== wachtwoord) return null
  setHuidigeGebruiker(gevonden)
  return gevonden
}

export function registreer(naam: string, email: string, wachtwoord: string): Gebruiker | null {
  const lijst = getAlleGebruikers()
  if (lijst.find(u => u.email === email)) return null
  const nieuw: Gebruiker = { email, naam, isAdmin: false, voortgang: {} }
  localStorage.setItem(`ior2_pw_${email}`, wachtwoord)
  slaGebruikerOp(nieuw)
  setHuidigeGebruiker(nieuw)
  return nieuw
}

export function updateVoortgang(conceptId: string, score: number) {
  const g = getHuidigeGebruiker()
  if (!g) return
  g.voortgang[conceptId] = { voltooid: true, score }
  setHuidigeGebruiker(g)
}

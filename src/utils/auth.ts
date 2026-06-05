import type { Gebruiker, VakId } from '../types'

const STORAGE_KEY = 'ior2_gebruiker'
const GEBRUIKERS_KEY = 'ior2_gebruikers'
const VAK_KEY = 'ior_huidig_vak'

export function getHuidigeGebruiker(): Gebruiker | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const g = JSON.parse(raw) as Gebruiker
    // Backwards compat: bestaande gebruikers hebben nog geen voortgangIOR3
    if (!g.voortgangIOR3) g.voortgangIOR3 = {}
    return g
  } catch { return null }
}

export function setHuidigeGebruiker(g: Gebruiker) {
  if (!g.voortgangIOR3) g.voortgangIOR3 = {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(g))
  slaGebruikerOp(g)
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(VAK_KEY)
}

export function getHuidigVak(): VakId {
  return (localStorage.getItem(VAK_KEY) as VakId) ?? 'ior2'
}

export function setHuidigVak(vak: VakId) {
  localStorage.setItem(VAK_KEY, vak)
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
  try {
    const lijst = JSON.parse(raw) as Gebruiker[]
    return lijst.map(g => ({ voortgangIOR3: {}, ...g }))
  } catch { return [] }
}

export function login(email: string, wachtwoord: string): Gebruiker | null {
  if (email === 'admin@ior2.be' && wachtwoord === 'admin2026') {
    const admin: Gebruiker = { email, naam: 'Admin', isAdmin: true, voortgang: {}, voortgangIOR3: {} }
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
  const nieuw: Gebruiker = { email, naam, isAdmin: false, voortgang: {}, voortgangIOR3: {} }
  localStorage.setItem(`ior2_pw_${email}`, wachtwoord)
  slaGebruikerOp(nieuw)
  setHuidigeGebruiker(nieuw)
  return nieuw
}

export function updateVoortgang(conceptId: string, score: number, vak: VakId = 'ior2') {
  const g = getHuidigeGebruiker()
  if (!g) return
  if (vak === 'ior3') {
    g.voortgangIOR3[conceptId] = { voltooid: true, score }
  } else {
    g.voortgang[conceptId] = { voltooid: true, score }
  }
  setHuidigeGebruiker(g)
}

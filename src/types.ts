export type VakId = 'ior2' | 'ior3'

export interface Gebruiker {
  email: string
  naam: string
  isAdmin: boolean
  voortgang: Record<string, ConceptVoortgang>
  voortgangIOR3: Record<string, ConceptVoortgang>
}

export interface ConceptVoortgang {
  voltooid: boolean
  score: number
}

export interface Concept {
  id: string
  naam: string
  modelantwoord?: string
}

export interface Hoofdstuk {
  id: string
  titel: string
  beschrijving: string
  concepten: Concept[]
}

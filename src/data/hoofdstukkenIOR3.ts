import type { Hoofdstuk } from '../types'
import { ior3Chapters } from './ior3Questions'

// Automatisch afgeleide Hoofdstuk-structuur vanuit ior3Questions
export const HOOFDSTUKKEN_IOR3: Hoofdstuk[] = ior3Chapters.map(chapter => ({
  id: chapter.id,
  titel: chapter.title,
  beschrijving: `${chapter.questions.length} exam questions`,
  concepten: chapter.questions.map(q => ({
    id: q.id,
    naam: q.question.length > 60 ? q.question.slice(0, 57) + '...' : q.question,
  })),
}))

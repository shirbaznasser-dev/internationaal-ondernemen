const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

async function roepClaudeAan(system: string, user: string): Promise<string> {
  const key = import.meta.env.VITE_CLAUDE_API_KEY
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API fout: ${res.status} – ${err}`)
  }
  const data = await res.json()
  return data.content[0].text as string
}

function cacheSleutel(type: 'uitleg' | 'vraag', conceptNaam: string): string {
  return `cache_${type}_${conceptNaam}`
}

function leesUitCache(type: 'uitleg' | 'vraag', conceptNaam: string): string | null {
  return localStorage.getItem(cacheSleutel(type, conceptNaam))
}

function schrijfNaarCache(type: 'uitleg' | 'vraag', conceptNaam: string, tekst: string) {
  localStorage.setItem(cacheSleutel(type, conceptNaam), tekst)
}

export type BronIndicator = 'cache' | 'nieuw'

const SYSTEM_UITLEG =
  "Je bent een leerhulp voor Internationaal Ondernemen IOR2 aan KdG. Leg concepten uit in helder Nederlands met concrete voorbeelden. Gebruik korte alinea's. Max 200 woorden."

const SYSTEM_EXAMEN =
  "Je bent een examenbegeleider voor Internationaal Ondernemen IOR2 aan KdG. Je toont de examenvraag en daarna het officiële modelantwoord. Formatteer duidelijk met **Examenvraag:** en **Modelantwoord:** als koppen. Voeg geen extra uitleg toe buiten het modelantwoord."

const SYSTEM_VRAAG =
  'Je bent een examenvraag-generator voor Internationaal Ondernemen IOR2. Genereer ALLEEN de vraag, geen antwoord. Wissel af tussen: begrip uitleggen, juist/fout met redenering, open redenering, kleine casus.'

const SYSTEM_FEEDBACK =
  'Je bent een eerlijke maar motiverende examencorrector voor Internationaal Ondernemen IOR2. Geef score /10, zeg wat goed was, wat ontbrak, en geef het correcte antwoord. Formaat: begin met "Score: X/10", dan "Wat goed was:", dan "Wat ontbrak:", dan "Correct antwoord:".'

export async function haalUitleg(
  conceptNaam: string,
  modelantwoord?: string
): Promise<{ tekst: string; bron: BronIndicator }> {
  const cached = leesUitCache('uitleg', conceptNaam)
  if (cached) return { tekst: cached, bron: 'cache' }

  let tekst: string
  if (modelantwoord) {
    tekst = await roepClaudeAan(
      SYSTEM_EXAMEN,
      `Examenvraag over '${conceptNaam}'.\n\nModelantwoord:\n${modelantwoord}\n\nToon dit netjes geformatteerd als examenoverzicht.`
    )
  } else {
    tekst = await roepClaudeAan(
      SYSTEM_UITLEG,
      `Leg het concept '${conceptNaam}' uit voor een hogeschoolstudent. Geef ook een concreet voorbeeld uit de praktijk.`
    )
  }
  schrijfNaarCache('uitleg', conceptNaam, tekst)
  return { tekst, bron: 'nieuw' }
}

export async function genereerVraag(
  conceptNaam: string
): Promise<{ tekst: string; bron: BronIndicator }> {
  const cached = leesUitCache('vraag', conceptNaam)
  if (cached) return { tekst: cached, bron: 'cache' }
  const tekst = await roepClaudeAan(
    SYSTEM_VRAAG,
    `Genereer een examenvraag over '${conceptNaam}'. Niveau: hogeschool bachelor.`
  )
  schrijfNaarCache('vraag', conceptNaam, tekst)
  return { tekst, bron: 'nieuw' }
}

export async function evalueerAntwoord(
  conceptNaam: string,
  vraag: string,
  antwoord: string
): Promise<string> {
  return roepClaudeAan(
    SYSTEM_FEEDBACK,
    `Concept: ${conceptNaam}\nVraag: ${vraag}\nAntwoord student: ${antwoord}\nEvalueer dit antwoord.`
  )
}

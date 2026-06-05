import type { VakId } from '../types'

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

// Streaming versie — roept onChunk aan voor elk stukje tekst
export async function roepClaudeAanStreaming(
  system: string,
  user: string,
  onChunk: (tekst: string) => void
): Promise<string> {
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
      stream: true,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API fout: ${res.status} – ${err}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let volledigeTekst = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const regels = buffer.split('\n')
    buffer = regels.pop() ?? ''

    for (const regel of regels) {
      if (!regel.startsWith('data: ')) continue
      const data = regel.slice(6).trim()
      if (data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
          const stuk = json.delta.text as string
          volledigeTekst += stuk
          onChunk(volledigeTekst)
        }
      } catch { /* negeer parse-fouten */ }
    }
  }
  return volledigeTekst
}

// Niet-streaming fallback voor evaluatie
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

function cacheSleutel(type: 'uitleg' | 'vraag', conceptNaam: string, vak: VakId): string {
  return `cache_${vak}_${type}_${conceptNaam}`
}

function leesUitCache(type: 'uitleg' | 'vraag', conceptNaam: string, vak: VakId): string | null {
  // Probeer ook oude cache-sleutel (zonder vak prefix) voor backwards compat
  return localStorage.getItem(cacheSleutel(type, conceptNaam, vak))
    ?? (vak === 'ior2' ? localStorage.getItem(`cache_${type}_${conceptNaam}`) : null)
}

function schrijfNaarCache(type: 'uitleg' | 'vraag', conceptNaam: string, vak: VakId, tekst: string) {
  localStorage.setItem(cacheSleutel(type, conceptNaam, vak), tekst)
}

export type BronIndicator = 'cache' | 'nieuw'

const SYSTEM_UITLEG_IOR2 =
  "Je bent een leerhulp voor Internationaal Ondernemen IOR2 aan KdG. Leg concepten uit in helder Nederlands met concrete voorbeelden. Gebruik korte alinea's. Max 200 woorden."

const SYSTEM_UITLEG_IOR3 =
  "Je bent een leerhulp voor het vak International Entrepreneurship III (IOR3) aan de Karel de Grote Hogeschool. Het vak gaat over B2B omgevingen: industrial procurement, Kaizen/TPS, intellectual property, geopolitiek en HR/diversiteit. Leg concepten uit in helder Nederlands met concrete B2B voorbeelden. Het examen test begrip, toepassing en illustratie. Max 200 woorden."

const SYSTEM_EXAMEN =
  "Je bent een examenbegeleider voor Internationaal Ondernemen IOR2 aan KdG. Je toont de examenvraag en daarna het officiële modelantwoord. Formatteer duidelijk met **Examenvraag:** en **Modelantwoord:** als koppen. Voeg geen extra uitleg toe buiten het modelantwoord."

const SYSTEM_VRAAG_IOR2 =
  'Je bent een examenvraag-generator voor Internationaal Ondernemen IOR2. Genereer ALLEEN de vraag, geen antwoord. Wissel af tussen: begrip uitleggen, juist/fout met redenering, open redenering, kleine casus.'

const SYSTEM_VRAAG_IOR3 =
  'Je bent een examenvraag-generator voor International Entrepreneurship III (IOR3) aan KdG. Het vak gaat over B2B procurement, Kaizen/TPS, IP, geopolitiek en HR. Genereer ALLEEN de vraag, geen antwoord. Wissel af tussen: begrip uitleggen, casus toepassen, vergelijken, illustreren met voorbeeld.'

const SYSTEM_FEEDBACK_IOR2 =
  'Je bent een eerlijke maar motiverende examencorrector voor Internationaal Ondernemen IOR2. Geef score /10, zeg wat goed was, wat ontbrak, en geef het correcte antwoord. Formaat: begin met "Score: X/10", dan "Wat goed was:", dan "Wat ontbrak:", dan "Correct antwoord:".'

const SYSTEM_FEEDBACK_IOR3 =
  'Je bent een eerlijke maar motiverende examencorrector voor IOR3 (International Entrepreneurship III) aan KdG. Geef score /10, zeg wat goed was, wat ontbrak, en geef het correcte antwoord vanuit B2B/IOR3 perspectief. Formaat: begin met "Score: X/10", dan "Wat goed was:", dan "Wat ontbrak:", dan "Correct antwoord:".'

export async function haalUitleg(
  conceptNaam: string,
  vak: VakId = 'ior2',
  modelantwoord?: string,
  onChunk?: (tekst: string) => void
): Promise<{ tekst: string; bron: BronIndicator }> {
  const cached = leesUitCache('uitleg', conceptNaam, vak)
  if (cached) return { tekst: cached, bron: 'cache' }

  let system: string, userMsg: string
  if (modelantwoord) {
    system = SYSTEM_EXAMEN
    userMsg = `Examenvraag over '${conceptNaam}'.\n\nModelantwoord:\n${modelantwoord}\n\nToon dit netjes geformatteerd als examenoverzicht.`
  } else {
    system = vak === 'ior3' ? SYSTEM_UITLEG_IOR3 : SYSTEM_UITLEG_IOR2
    userMsg = `Leg het concept '${conceptNaam}' uit voor een hogeschoolstudent. Geef ook een concreet voorbeeld uit de praktijk.`
  }

  const tekst = onChunk
    ? await roepClaudeAanStreaming(system, userMsg, onChunk)
    : await roepClaudeAan(system, userMsg)

  schrijfNaarCache('uitleg', conceptNaam, vak, tekst)
  return { tekst, bron: 'nieuw' }
}

export async function genereerVraag(
  conceptNaam: string,
  vak: VakId = 'ior2',
  onChunk?: (tekst: string) => void
): Promise<{ tekst: string; bron: BronIndicator }> {
  const cached = leesUitCache('vraag', conceptNaam, vak)
  if (cached) return { tekst: cached, bron: 'cache' }
  const system = vak === 'ior3' ? SYSTEM_VRAAG_IOR3 : SYSTEM_VRAAG_IOR2
  const userMsg = `Genereer een examenvraag over '${conceptNaam}'. Niveau: hogeschool bachelor.`
  const tekst = onChunk
    ? await roepClaudeAanStreaming(system, userMsg, onChunk)
    : await roepClaudeAan(system, userMsg)
  schrijfNaarCache('vraag', conceptNaam, vak, tekst)
  return { tekst, bron: 'nieuw' }
}

export async function evalueerAntwoord(
  conceptNaam: string,
  vraag: string,
  antwoord: string,
  vak: VakId = 'ior2'
): Promise<string> {
  const systemPrompt = vak === 'ior3' ? SYSTEM_FEEDBACK_IOR3 : SYSTEM_FEEDBACK_IOR2
  return roepClaudeAan(
    systemPrompt,
    `Concept: ${conceptNaam}\nVraag: ${vraag}\nAntwoord student: ${antwoord}\nEvalueer dit antwoord.`
  )
}

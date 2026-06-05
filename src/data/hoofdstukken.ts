import type { Hoofdstuk } from '../types'

export const HOOFDSTUKKEN: Hoofdstuk[] = [
  {
    id: '1',
    titel: 'Handelstheorieën',
    beschrijving: 'Mercantilisme, Smith, Ricardo, HOS, Vraag & Aanbod',
    concepten: [
      { id: 'mercantilisme', naam: 'Mercantilisme' },
      { id: 'absolute_voordelen', naam: 'Absolute Voordelen (Adam Smith)' },
      { id: 'comparatieve_voordelen', naam: 'Comparatieve Voordelen (Ricardo)' },
      { id: 'heckscher_ohlin', naam: 'Heckscher-Ohlin Theorema' },
      { id: 'vraag_aanbod_internationaal', naam: 'Vraag & Aanbod op internationale markten' },
      { id: 'consumentensurplus', naam: 'Consumentensurplus' },
      { id: 'producentensurplus', naam: 'Producentensurplus' },
      { id: 'factormobiliteit', naam: 'Factormobiliteit' },
    ],
  },
  {
    id: '2',
    titel: 'Handelspolitiek & Protectionisme',
    beschrijving: 'Heffingen, Quota, Exportsubsidies, WTO, Dumping',
    concepten: [
      { id: 'heffingen_soorten', naam: 'Soorten Invoerheffingen' },
      { id: 'herkomst_vs_oorsprong', naam: 'Herkomst vs. Oorsprong van goederen' },
      { id: 'invoerquota', naam: 'Invoerquota' },
      { id: 'vrijwillige_exportbeperking', naam: 'Vrijwillige Exportbeperking (VER)' },
      { id: 'niet_tarifaire_belemmeringen', naam: 'Niet-tarifaire Handelsbelemmeringen' },
      { id: 'exportsubsidies', naam: 'Exportsubsidies' },
      { id: 'dumping', naam: 'Dumping' },
      { id: 'protectionisme_argumenten', naam: 'Argumenten voor Protectionisme' },
      { id: 'wto_positie', naam: 'WTO en vrijhandel' },
    ],
  },
  {
    id: '3',
    titel: 'Globalisering',
    beschrijving: 'Globaal vs multinationaal, DBI, Milieu, Andersglobalisten',
    concepten: [
      { id: 'globaal_vs_multinationaal', naam: 'Globaal vs. Multinationaal ondernemen' },
      { id: 'vier_dimensies_globalisering', naam: 'Vier dimensies van globalisering' },
      { id: 'dbi_flux_stock', naam: 'Directe Buitenlandse Investeringen (flux & stock)' },
      { id: 'globalisering_nadelen', naam: 'Nadelen van globalisering' },
      { id: 'transfer_pricing', naam: 'Transfer Pricing' },
      { id: 'milieu_vrijhandel', naam: 'Milieu en vrijhandel' },
      { id: 'andersglobalisten', naam: 'Andersglobalisten' },
      { id: 'ontwikkelingslanden_opties', naam: 'Opties voor ontwikkelingslanden' },
    ],
  },
  {
    id: '4',
    titel: 'Financiële Markten & Wisselkoersen',
    beschrijving: 'Kapitaalmarkt, Wisselmarkt, Ruilvoet, Betalingsbalans',
    concepten: [
      { id: 'aandelenmarkt', naam: 'Aandelenmarkt' },
      { id: 'obligatiemarkt', naam: 'Obligatiemarkt' },
      { id: 'wisselmarkt_werking', naam: 'Werking van de wisselmarkt' },
      { id: 'wisselkoersrisico', naam: 'Wisselkoersrisico' },
      { id: 'termijnmarkt', naam: 'Termijnmarkt en afdekking' },
      { id: 'swap_transacties', naam: 'Swap-transacties' },
      { id: 'ruilvoet', naam: 'Ruilvoet (Terms of Trade)' },
      { id: 'betalingsbalans', naam: 'Betalingsbalans' },
      { id: 'wisselkoerssystemen', naam: 'Wisselkoerssystemen' },
      { id: 'imf_wereldbank_g20', naam: 'IMF, Wereldbank en G20' },
    ],
  },
  {
    id: 'h5',
    titel: 'Oefenexamen — Januari 2025',
    beschrijving: 'Echte examenvragen van KdG met modelantwoorden',
    concepten: [
      {
        id: 'h5-begrip-1',
        naam: 'Begrip: Leontief Paradox',
        modelantwoord: `De bevinding van Wassily Leontief (1953) dat de VS, ondanks kapitaalrijkdom, meer arbeidsintensieve goederen exporteerde dan importeerde. Dit leek in tegenspraak met de HOS-theorie.\n\n**Verklaring:** Amerikaanse arbeid is productiever/kwalitatief hoger, of de VS importeert kapitaalintensieve grondstoffen.`,
      },
      {
        id: 'h5-begrip-2',
        naam: 'Begrip: Communautaire Goederen',
        modelantwoord: `Goederen die door de EU als geheel worden beheerd via gemeenschappelijk beleid (bv. landbouwproducten via het GLB). De EU onderhandelt als één blok over invoer/uitvoer — geen individueel lidstaatbeleid mogelijk.`,
      },
      {
        id: 'h5-begrip-3',
        naam: 'Begrip: Swap Transactie',
        modelantwoord: `Gelijktijdige aan- en verkoop van een valuta voor verschillende vervaldagen.\n\n**Voorbeeld:** je koopt vandaag EUR/USD op de spotmarkt én verkoopt tegelijk EUR/USD op de termijnmarkt. Gebruikt voor afdekking van wisselkoersrisico zonder nettopositie.`,
      },
      {
        id: 'h5-begrip-4',
        naam: 'Begrip: Crawling Peg',
        modelantwoord: `Een wisselkoerssysteem waarbij de koers gekoppeld is aan een referentievaluta maar periodiek kleine aanpassingen worden toegestaan (bv. maandelijks 1%). Combineert stabiliteit van een vaste koers met flexibiliteit om inflatieverschillen te compenseren.`,
      },
      {
        id: 'h5-keuze-a',
        naam: 'Keuze A: Handelsintensiteit & Productiefactoren',
        modelantwoord: `**Antwoord: MEER**\n\nBij hogere handelsintensiteit specialiseren landen zich meer, waardoor productiefactoren (arbeid, kapitaal) intensiever tussen landen stromen.`,
      },
      {
        id: 'h5-keuze-b',
        naam: 'Keuze B: Kartelvorming & Prijselasticiteit',
        modelantwoord: `**Antwoord: GROTER marktaandeel + LAGER prijselasticiteit**\n\nHoe groter het gezamenlijke marktaandeel, hoe meer marktmacht. Hoe lager de prijselasticiteit, hoe minder consumenten reageren op prijsstijgingen → kartel effectiever.`,
      },
      {
        id: 'h5-keuze-c',
        naam: 'Keuze C: Managed Float vs Adjustable Peg',
        modelantwoord: `**Antwoord: MINDER**\n\nBij managed float laat de overheid de koers grotendeels door de markt bepalen en grijpt alleen in bij extreme schommelingen. Bij adjustable peg moet ze actief de koers verdedigen binnen een vaste band.`,
      },
      {
        id: 'h5-keuze-d',
        naam: 'Keuze D: Invoerheffingen & Surplus',
        modelantwoord: `**Antwoord: UITVOEREND land + MEER**\n\nInvoerheffingen verhogen de binnenlandse prijs in het invoerende land. Producenten in het uitvoerende land krijgen hogere prijzen → producentensurplus stijgt. Dit surplus is groter dan het consumentensurplus dat verloren gaat in het invoerende land (netto welvaartsoverdracht).`,
      },
      {
        id: 'h5-open-1',
        naam: 'Open vraag: Productlevenscyclus van Vernon',
        modelantwoord: `**3 fases:**\n\n1. **Nieuwe productfase** — innovatie in rijke landen (VS), productie & consumptie lokaal, export beperkt.\n2. **Groei/rijpingsfase** — standaardisering, export naar andere rijke landen, begin productie in buitenland.\n3. **Gestandaardiseerde fase** — massaproductie, productie verschuift naar lage-loonlanden, innovatieland wordt importeur.\n\n**Grafiek:** x-as = tijd, y-as = productie/consumptie/handel per regio.`,
      },
      {
        id: 'h5-open-2',
        naam: 'Open vraag: Wetgevende organen EU',
        modelantwoord: `1. **Europees Parlement** — rechtstreeks verkozen, medewetgever via gewone wetgevingsprocedure.\n2. **Raad van de EU (Ministerraad)** — vertegenwoordigt lidstaten, medewetgever.\n3. **Europese Commissie** — exclusief initiatiefrecht, stelt wetgeving voor.\n4. **Europese Raad** — bepaalt strategische richting, geen wetgevende rol.\n\n**Gewone wetgevingsprocedure:** Commissie stelt voor → Parlement + Raad keuren goed.`,
      },
      {
        id: 'h5-open-3',
        naam: 'Open vraag: Covered Interest Arbitrage',
        modelantwoord: `**Stap 1:** Leen $500.000 aan 2% → moet $510.000 terugbetalen.\n**Stap 2:** Wissel naar £500.000 (spotkoers 1:1).\n**Stap 3:** Beleg £500.000 aan 4% → krijg £520.000.\n**Stap 4:** Verkoop £520.000 forward aan 1,0125 → krijg $526.500.\n**Stap 5:** Betaal lening terug $510.000.\n\n**WINST = $526.500 − $510.000 = $16.500**`,
      },
      {
        id: 'h5-open-4',
        naam: 'Open vraag: Stabiel wisselkoerssysteem',
        modelantwoord: `**Instrumenten:**\n\n1. **Deviezenreserves gebruiken** — koop eigen munt op de markt bij druk.\n2. **Rentepolitiek** — verhoog rente om kapitaal aan te trekken en munt te versterken.\n3. **Kapitaalcontroles** — beperk in/uitstroom van kapitaal.\n4. **IMF-steun aanvragen** — extra reserves verkrijgen.\n5. **Wisselkoersaanpassing (devaluatie)** als laatste redmiddel.`,
      },
    ],
  },
]

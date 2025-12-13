// Mock data voor regelingen - echte Nederlandse toeslagen en regelingen
// Dit wordt later vervangen door echte Supabase data

export interface Regeling {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: "toeslagen" | "uitkeringen" | "subsidies" | "kindregelingen" | "wonen";
  provider: string;
  maxBedrag?: string;
  requirements: string[];
  documentsNeeded: string[];
  aanvraagUrl?: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface IntakeMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Match {
  id: string;
  regelingId: string;
  regeling: Regeling;
  matchScore: number; // 0-100
  status: "potentieel" | "in_behandeling" | "goedgekeurd" | "afgewezen";
  reasoning: string;
}

export interface Application {
  id: string;
  regelingId: string;
  regeling: Regeling;
  status: "concept" | "in_review" | "ingediend" | "goedgekeurd" | "afgewezen";
  draftContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: "inkomen" | "identiteit" | "wonen" | "gezin" | "overig";
  uploadedAt: Date;
  size: number;
}

export const REGELINGEN: Regeling[] = [
  {
    id: "1",
    slug: "zorgtoeslag",
    name: "Zorgtoeslag",
    shortDescription: "Tegemoetkoming in de kosten van je zorgverzekering",
    description:
      "Zorgtoeslag is een bijdrage van de overheid in de kosten van je zorgverzekering. Je krijgt zorgtoeslag als je verzekerd bent voor de Zorgverzekeringswet en een laag inkomen hebt. De hoogte van de toeslag hangt af van je inkomen en of je een toeslagpartner hebt.",
    category: "toeslagen",
    provider: "Belastingdienst/Toeslagen",
    maxBedrag: "€ 154 per maand (2024)",
    requirements: [
      "Je hebt een Nederlandse zorgverzekering",
      "Je bent 18 jaar of ouder",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning",
      "Je inkomen is niet te hoog (grenzen verschillen per situatie)",
      "Je vermogen is niet te hoog (€ 127.582 voor alleenstaanden in 2024)",
    ],
    documentsNeeded: [
      "DigiD",
      "Jaaropgave of loonstrook",
      "Gegevens zorgverzekering",
    ],
    aanvraagUrl: "https://www.belastingdienst.nl/toeslagen",
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "2",
    slug: "huurtoeslag",
    name: "Huurtoeslag",
    shortDescription: "Bijdrage voor huurders met een laag inkomen",
    description:
      "Huurtoeslag is een bijdrage van de overheid in je huurkosten. Je kunt huurtoeslag krijgen als je een zelfstandige woonruimte huurt en je inkomen niet te hoog is. De woning moet ook aan bepaalde eisen voldoen.",
    category: "wonen",
    provider: "Belastingdienst/Toeslagen",
    maxBedrag: "Afhankelijk van huur en inkomen",
    requirements: [
      "Je huurt een zelfstandige woonruimte",
      "Je bent 18 jaar of ouder",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning",
      "Je huur is niet hoger dan € 879,66 per maand (2024)",
      "Je inkomen en vermogen zijn niet te hoog",
      "Je woont op het adres waar je staat ingeschreven",
    ],
    documentsNeeded: [
      "DigiD",
      "Huurcontract",
      "Jaaropgave of loonstrook",
    ],
    aanvraagUrl: "https://www.belastingdienst.nl/toeslagen",
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "3",
    slug: "kindgebonden-budget",
    name: "Kindgebonden Budget",
    shortDescription: "Extra geld voor gezinnen met kinderen",
    description:
      "Het kindgebonden budget is een bijdrage van de overheid voor gezinnen met kinderen. Je krijgt dit automatisch als je recht hebt op kinderbijslag en je inkomen niet te hoog is. Alleenstaande ouders krijgen extra.",
    category: "kindregelingen",
    provider: "Belastingdienst/Toeslagen",
    maxBedrag: "Tot € 3.848 per jaar (bij 1 kind, alleenstaand)",
    requirements: [
      "Je hebt recht op kinderbijslag",
      "Je kind is jonger dan 18 jaar",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning",
      "Je inkomen is niet te hoog",
      "Je vermogen is niet te hoog",
    ],
    documentsNeeded: [
      "DigiD",
      "Jaaropgave of loonstrook",
    ],
    aanvraagUrl: "https://www.belastingdienst.nl/toeslagen",
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "4",
    slug: "kinderopvangtoeslag",
    name: "Kinderopvangtoeslag",
    shortDescription: "Vergoeding voor kosten kinderopvang",
    description:
      "Kinderopvangtoeslag is een bijdrage van de overheid in de kosten van kinderopvang. Je kunt deze toeslag krijgen als je werkt, studeert of een traject naar werk volgt en je kind naar een geregistreerde kinderopvang gaat.",
    category: "kindregelingen",
    provider: "Belastingdienst/Toeslagen",
    maxBedrag: "Tot 96% van de kosten (afhankelijk van inkomen)",
    requirements: [
      "Je werkt, studeert of volgt een traject naar werk",
      "Je kind gaat naar geregistreerde kinderopvang",
      "Je kind staat op jouw adres ingeschreven",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning",
      "Je betaalt zelf (een deel van) de opvangkosten",
    ],
    documentsNeeded: [
      "DigiD",
      "Contract kinderopvang",
      "Jaaropgave of loonstrook",
      "Gegevens werkgever of opleiding",
    ],
    aanvraagUrl: "https://www.belastingdienst.nl/toeslagen",
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "5",
    slug: "kinderbijslag",
    name: "Kinderbijslag",
    shortDescription: "Kwartaalbijdrage voor ouders met kinderen",
    description:
      "Kinderbijslag is een bijdrage van de overheid voor de kosten van je kinderen. Je krijgt kinderbijslag tot je kind 18 jaar wordt. Het bedrag hangt af van de leeftijd van je kind.",
    category: "kindregelingen",
    provider: "Sociale Verzekeringsbank (SVB)",
    maxBedrag: "€ 269,76 - € 323,03 per kwartaal per kind (2024)",
    requirements: [
      "Je kind is jonger dan 18 jaar",
      "Je kind woont bij jou of je betaalt voor het onderhoud",
      "Je bent verzekerd voor de kinderbijslag",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning",
    ],
    documentsNeeded: [
      "DigiD",
      "Geboorteakte kind (bij eerste aanvraag)",
    ],
    aanvraagUrl: "https://www.svb.nl/kinderbijslag",
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "6",
    slug: "bijstand",
    name: "Bijstandsuitkering",
    shortDescription: "Uitkering als je geen of onvoldoende inkomen hebt",
    description:
      "De bijstandsuitkering is een uitkering van de gemeente voor mensen die geen of te weinig inkomen hebben om van te leven. Je moet wel aan bepaalde voorwaarden voldoen en actief op zoek zijn naar werk.",
    category: "uitkeringen",
    provider: "Gemeente",
    maxBedrag: "€ 1.136,88 - € 1.623,98 per maand (netto, 2024)",
    requirements: [
      "Je hebt niet genoeg inkomen om van te leven",
      "Je hebt niet te veel vermogen",
      "Je bent 18 jaar of ouder",
      "Je woont in Nederland",
      "Je staat ingeschreven bij UWV als werkzoekende",
      "Je bent bereid te werken of een opleiding te volgen",
    ],
    documentsNeeded: [
      "DigiD",
      "Identiteitsbewijs",
      "Bankafschriften (3 maanden)",
      "Huurcontract of hypotheekgegevens",
      "Loonstroken of uitkeringsspecificaties",
    ],
    aanvraagUrl: "https://www.werk.nl",
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "7",
    slug: "alleenstaande-ouder-korting",
    name: "Alleenstaande Ouderkorting",
    shortDescription: "Extra belastingvoordeel voor alleenstaande ouders",
    description:
      "De alleenstaande ouderkorting is een extra heffingskorting voor alleenstaande ouders. Je krijgt automatisch deze korting via de inkomstenbelasting als je aan de voorwaarden voldoet.",
    category: "kindregelingen",
    provider: "Belastingdienst",
    maxBedrag: "€ 2.694 per jaar (2024)",
    requirements: [
      "Je bent alleenstaand (geen fiscaal partner)",
      "Je hebt een kind dat bij je woont en jonger is dan 18 jaar",
      "Je hebt recht op kinderbijslag",
      "Je hebt inkomsten uit werk",
    ],
    documentsNeeded: [
      "Aangifte inkomstenbelasting",
    ],
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "8",
    slug: "woonkostentoeslag",
    name: "Woonkostentoeslag",
    shortDescription: "Gemeentelijke bijdrage bij hoge woonlasten",
    description:
      "Woonkostentoeslag is een tijdelijke bijdrage van de gemeente als je woonlasten te hoog zijn voor je inkomen. Dit kan bijvoorbeeld na scheiding of inkomensdaling. De regeling verschilt per gemeente.",
    category: "wonen",
    provider: "Gemeente",
    maxBedrag: "Verschilt per gemeente",
    requirements: [
      "Je hebt een laag inkomen",
      "Je woonlasten zijn te hoog",
      "Je hebt geen recht op huurtoeslag of dit is onvoldoende",
      "Je woont in een koopwoning of huurt boven de huurtoeslaggrens",
    ],
    documentsNeeded: [
      "DigiD",
      "Bewijs van inkomen",
      "Bewijs van woonlasten",
      "Bankafschriften",
    ],
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "9",
    slug: "individuele-inkomenstoeslag",
    name: "Individuele Inkomenstoeslag",
    shortDescription: "Jaarlijkse bijdrage bij langdurig laag inkomen",
    description:
      "De individuele inkomenstoeslag is een jaarlijkse uitkering van de gemeente voor mensen die al langere tijd een laag inkomen hebben. Het is bedoeld om een extraatje te geven voor onverwachte uitgaven.",
    category: "uitkeringen",
    provider: "Gemeente",
    maxBedrag: "€ 420 - € 590 per jaar (verschilt per gemeente)",
    requirements: [
      "Je hebt minimaal 3 jaar een laag inkomen",
      "Je hebt weinig vermogen",
      "Je bent 21 jaar of ouder",
      "Je hebt geen uitzicht op inkomensverbetering",
    ],
    documentsNeeded: [
      "DigiD",
      "Bewijs van inkomen (3 jaar)",
      "Bankafschriften",
    ],
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "10",
    slug: "bijzondere-bijstand",
    name: "Bijzondere Bijstand",
    shortDescription: "Vergoeding voor bijzondere noodzakelijke kosten",
    description:
      "Bijzondere bijstand is een vergoeding van de gemeente voor noodzakelijke kosten die je niet zelf kunt betalen. Denk aan kosten voor een bril, advocaat, of verhuizing. Je moet wel een laag inkomen hebben.",
    category: "uitkeringen",
    provider: "Gemeente",
    maxBedrag: "Afhankelijk van de kosten",
    requirements: [
      "Je hebt noodzakelijke kosten die je niet zelf kunt betalen",
      "Je hebt een laag inkomen",
      "De kosten vallen niet onder een andere regeling",
      "Je woont in de betreffende gemeente",
    ],
    documentsNeeded: [
      "DigiD",
      "Bewijs van de kosten (offerte of factuur)",
      "Bewijs van inkomen",
      "Bankafschriften",
    ],
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "11",
    slug: "kwijtschelding-gemeentelijke-belastingen",
    name: "Kwijtschelding Gemeentelijke Belastingen",
    shortDescription: "Vrijstelling van gemeentelijke belastingen",
    description:
      "Als je een laag inkomen hebt, kun je kwijtschelding krijgen voor gemeentelijke belastingen zoals afvalstoffenheffing en rioolheffing. De regeling verschilt per gemeente.",
    category: "subsidies",
    provider: "Gemeente",
    maxBedrag: "Volledige kwijtschelding mogelijk",
    requirements: [
      "Je hebt een laag inkomen (vaak rond bijstandsniveau)",
      "Je hebt weinig vermogen",
      "Je woont in de betreffende gemeente",
    ],
    documentsNeeded: [
      "DigiD",
      "Bewijs van inkomen",
      "Bankafschriften",
    ],
    lastUpdated: "2024-01-15",
    isActive: true,
  },
  {
    id: "12",
    slug: "gratis-ov-minima",
    name: "Gratis OV voor Minima",
    shortDescription: "Gratis of goedkoop openbaar vervoer",
    description:
      "Sommige gemeenten bieden gratis of goedkoop openbaar vervoer aan voor mensen met een laag inkomen. Dit kan een gratis OV-chipkaart zijn of korting op abonnementen.",
    category: "subsidies",
    provider: "Gemeente",
    maxBedrag: "Gratis OV of korting",
    requirements: [
      "Je hebt een laag inkomen",
      "Je woont in een gemeente die deze regeling aanbiedt",
      "Je bent ingeschreven bij de gemeente",
    ],
    documentsNeeded: [
      "Bewijs van inkomen",
      "Pasfoto",
    ],
    lastUpdated: "2024-01-15",
    isActive: true,
  },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    regelingId: "3",
    regeling: REGELINGEN.find((r) => r.id === "3")!,
    matchScore: 95,
    status: "potentieel",
    reasoning:
      "Op basis van je situatie als alleenstaande ouder met kinderen kom je zeer waarschijnlijk in aanmerking voor kindgebonden budget.",
  },
  {
    id: "m2",
    regelingId: "7",
    regeling: REGELINGEN.find((r) => r.id === "7")!,
    matchScore: 90,
    status: "potentieel",
    reasoning:
      "Als alleenstaande ouder met werkend inkomen heb je recht op de alleenstaande ouderkorting.",
  },
  {
    id: "m3",
    regelingId: "1",
    regeling: REGELINGEN.find((r) => r.id === "1")!,
    matchScore: 85,
    status: "in_behandeling",
    reasoning:
      "Met je huidige inkomen kom je waarschijnlijk in aanmerking voor zorgtoeslag.",
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "a1",
    regelingId: "3",
    regeling: REGELINGEN.find((r) => r.id === "3")!,
    status: "concept",
    draftContent:
      "Hierbij vraag ik kindgebonden budget aan voor mijn 2 kinderen...",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "d1",
    name: "Loonstrook_januari_2024.pdf",
    type: "application/pdf",
    category: "inkomen",
    uploadedAt: new Date("2024-01-15"),
    size: 245000,
  },
  {
    id: "d2",
    name: "Huurcontract.pdf",
    type: "application/pdf",
    category: "wonen",
    uploadedAt: new Date("2024-01-14"),
    size: 512000,
  },
];

export const CATEGORIES = [
  { value: "all", label: "Alle categorieën" },
  { value: "toeslagen", label: "Toeslagen" },
  { value: "uitkeringen", label: "Uitkeringen" },
  { value: "subsidies", label: "Subsidies" },
  { value: "kindregelingen", label: "Kindregelingen" },
  { value: "wonen", label: "Wonen" },
];

export const FAQ_ITEMS = [
  {
    question: "Wat is Hulpwijzer?",
    answer:
      "Hulpwijzer is een digitaal platform dat alleenstaande moeders helpt bij het vinden en aanvragen van financiële ondersteuning van de overheid. We gebruiken AI om je situatie te begrijpen en je te matchen met regelingen waar je recht op hebt.",
  },
  {
    question: "Is het gratis?",
    answer:
      "Ja, Hulpwijzer is volledig gratis. We worden niet betaald door de overheid of andere partijen. We zijn een non-profit initiatief.",
  },
  {
    question: "Hoe werkt het?",
    answer:
      "Je voert een kort gesprek met onze AI-assistent over je situatie. Op basis daarvan laten we zien voor welke regelingen je mogelijk in aanmerking komt. Vervolgens helpen we je met het voorbereiden van je aanvraag, die altijd door een vrijwilliger wordt gecontroleerd voordat je hem indient.",
  },
  {
    question: "Wie controleert mijn aanvraag?",
    answer:
      "Elke aanvraag wordt gecontroleerd door een getrainde vrijwilliger voordat je hem indient. Zo weet je zeker dat alles klopt en je de beste kans hebt op goedkeuring.",
  },
  {
    question: "Zijn mijn gegevens veilig?",
    answer:
      "Ja, we nemen privacy zeer serieus. We verzamelen alleen de gegevens die nodig zijn en slaan deze veilig op. We delen je gegevens nooit met derden zonder je toestemming.",
  },
  {
    question: "Kan ik ook bellen voor hulp?",
    answer:
      "Op dit moment bieden we alleen online ondersteuning. We werken eraan om in de toekomst ook telefonische hulp aan te bieden.",
  },
];

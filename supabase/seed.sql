-- Hulpwijzer Seed Data: Dutch Benefits/Regelingen
-- Run this after the migration in Supabase SQL Editor

INSERT INTO public.regelingen (slug, title, eligible_for, min_age, max_age, details) VALUES

-- 1. Huurtoeslag (Rent Allowance)
(
  'huurtoeslag',
  'Huurtoeslag',
  ARRAY['low_income', 'renter'],
  18,
  NULL,
  '{
    "description": "Een maandelijkse bijdrage in de huurkosten voor mensen met een laag inkomen.",
    "short_description": "Bijdrage in de huurkosten",
    "category": "housing",
    "requirements": [
      "Je huurt een zelfstandige woning",
      "Je huur is niet hoger dan €879,66 per maand",
      "Je inkomen is onder de inkomensgrens",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning"
    ],
    "documents_needed": [
      "Huurcontract",
      "Inkomensgegevens",
      "Identiteitsbewijs"
    ],
    "source_url": "https://www.belastingdienst.nl/huurtoeslag",
    "provider": "Belastingdienst",
    "how_to_apply": "Aanvragen via Mijn Toeslagen op belastingdienst.nl",
    "estimated_amount": "€50 - €400 per maand",
    "impact_score": 8
  }'::jsonb
),

-- 2. Zorgtoeslag (Healthcare Allowance)
(
  'zorgtoeslag',
  'Zorgtoeslag',
  ARRAY['low_income'],
  18,
  NULL,
  '{
    "description": "Een tegemoetkoming in de kosten van je zorgverzekering.",
    "short_description": "Bijdrage zorgverzekering",
    "category": "healthcare",
    "requirements": [
      "Je hebt een Nederlandse zorgverzekering",
      "Je inkomen is onder de inkomensgrens",
      "Je hebt de Nederlandse nationaliteit of een geldige verblijfsvergunning"
    ],
    "documents_needed": [
      "Zorgverzekeringspolis",
      "Inkomensgegevens"
    ],
    "source_url": "https://www.belastingdienst.nl/zorgtoeslag",
    "provider": "Belastingdienst",
    "how_to_apply": "Aanvragen via Mijn Toeslagen op belastingdienst.nl",
    "estimated_amount": "€120 - €175 per maand",
    "impact_score": 7
  }'::jsonb
),

-- 3. Kinderbijslag (Child Benefit)
(
  'kinderbijslag',
  'Kinderbijslag',
  ARRAY['parent', 'single_mom'],
  NULL,
  NULL,
  '{
    "description": "Een bijdrage in de kosten voor de opvoeding van je kind(eren).",
    "short_description": "Bijdrage per kind per kwartaal",
    "category": "childcare",
    "requirements": [
      "Je verzorgt en voedt een kind op",
      "Het kind woont bij jou",
      "Het kind is jonger dan 18 jaar"
    ],
    "documents_needed": [
      "Geboorteakte kind",
      "Identiteitsbewijs"
    ],
    "source_url": "https://www.svb.nl/kinderbijslag",
    "provider": "SVB (Sociale Verzekeringsbank)",
    "how_to_apply": "Automatisch na geboorteaangifte, of aanvragen via svb.nl",
    "estimated_amount": "€261 - €316 per kind per kwartaal",
    "impact_score": 9
  }'::jsonb
),

-- 4. Kindgebonden Budget
(
  'kindgebonden-budget',
  'Kindgebonden Budget',
  ARRAY['low_income', 'parent', 'single_mom'],
  NULL,
  NULL,
  '{
    "description": "Extra geld bovenop de kinderbijslag voor gezinnen met een lager inkomen.",
    "short_description": "Extra toeslag voor gezinnen met laag inkomen",
    "category": "childcare",
    "requirements": [
      "Je ontvangt kinderbijslag",
      "Je inkomen is onder de inkomensgrens",
      "Je kind is jonger dan 18 jaar"
    ],
    "documents_needed": [
      "Inkomensgegevens",
      "Kinderbijslag toekenning"
    ],
    "source_url": "https://www.belastingdienst.nl/kindgebonden-budget",
    "provider": "Belastingdienst",
    "how_to_apply": "Aanvragen via Mijn Toeslagen op belastingdienst.nl",
    "estimated_amount": "€100 - €500 per maand (afhankelijk van aantal kinderen)",
    "impact_score": 9
  }'::jsonb
),

-- 5. Kinderopvangtoeslag
(
  'kinderopvangtoeslag',
  'Kinderopvangtoeslag',
  ARRAY['working_parent', 'single_mom', 'student_parent'],
  NULL,
  NULL,
  '{
    "description": "Tegemoetkoming in de kosten van kinderopvang als je werkt of studeert.",
    "short_description": "Bijdrage kinderopvangkosten",
    "category": "childcare",
    "requirements": [
      "Je werkt, volgt een opleiding of re-integratietraject",
      "Je kind gaat naar geregistreerde kinderopvang",
      "Je kind is nog niet naar de basisschool"
    ],
    "documents_needed": [
      "Arbeidscontract of bewijs opleiding",
      "Contract kinderopvang",
      "Inkomensgegevens"
    ],
    "source_url": "https://www.belastingdienst.nl/kinderopvangtoeslag",
    "provider": "Belastingdienst",
    "how_to_apply": "Aanvragen via Mijn Toeslagen op belastingdienst.nl",
    "estimated_amount": "Tot 96% van de kosten vergoed",
    "impact_score": 10
  }'::jsonb
),

-- 6. Bijzondere Bijstand
(
  'bijzondere-bijstand',
  'Bijzondere Bijstand',
  ARRAY['low_income', 'financial_hardship'],
  18,
  NULL,
  '{
    "description": "Eenmalige of periodieke vergoeding voor noodzakelijke kosten die je niet zelf kunt betalen.",
    "short_description": "Hulp bij onverwachte kosten",
    "category": "income",
    "requirements": [
      "Je hebt een laag inkomen",
      "Je hebt geen vermogen om de kosten zelf te betalen",
      "De kosten zijn noodzakelijk"
    ],
    "documents_needed": [
      "Inkomensgegevens",
      "Bankafschriften",
      "Bewijs van de kosten"
    ],
    "source_url": "https://www.rijksoverheid.nl/bijzondere-bijstand",
    "provider": "Gemeente",
    "how_to_apply": "Aanvragen bij je gemeente",
    "estimated_amount": "Afhankelijk van situatie",
    "impact_score": 6
  }'::jsonb
),

-- 7. Individuele Inkomenstoeslag
(
  'individuele-inkomenstoeslag',
  'Individuele Inkomenstoeslag',
  ARRAY['low_income', 'long_term_low_income'],
  21,
  65,
  '{
    "description": "Jaarlijkse toeslag voor mensen die langdurig een laag inkomen hebben.",
    "short_description": "Jaarlijkse toeslag bij langdurig laag inkomen",
    "category": "income",
    "requirements": [
      "Je hebt minimaal 3 jaar een laag inkomen",
      "Je hebt geen uitzicht op inkomensverbetering",
      "Je voldoet aan de vermogensgrens"
    ],
    "documents_needed": [
      "Inkomensgegevens afgelopen 3 jaar",
      "Bankafschriften"
    ],
    "source_url": "https://www.rijksoverheid.nl/individuele-inkomenstoeslag",
    "provider": "Gemeente",
    "how_to_apply": "Aanvragen bij je gemeente",
    "estimated_amount": "€400 - €600 per jaar",
    "impact_score": 5
  }'::jsonb
),

-- 8. Kwijtschelding Gemeentelijke Belastingen
(
  'kwijtschelding-belastingen',
  'Kwijtschelding Gemeentelijke Belastingen',
  ARRAY['low_income'],
  18,
  NULL,
  '{
    "description": "Kwijtschelding van gemeentelijke belastingen zoals afvalstoffenheffing en rioolheffing.",
    "short_description": "Geen gemeentelijke belastingen betalen",
    "category": "income",
    "requirements": [
      "Je hebt een laag inkomen",
      "Je hebt geen of weinig vermogen"
    ],
    "documents_needed": [
      "Inkomensgegevens",
      "Bankafschriften",
      "Belastingaanslag"
    ],
    "source_url": "https://www.rijksoverheid.nl/kwijtschelding",
    "provider": "Gemeente",
    "how_to_apply": "Aanvragen bij je gemeente of via Mijn Belastingen",
    "estimated_amount": "€200 - €500 per jaar besparing",
    "impact_score": 4
  }'::jsonb
),

-- 9. Schuldhulpverlening
(
  'schuldhulpverlening',
  'Schuldhulpverlening',
  ARRAY['debt', 'financial_hardship'],
  18,
  NULL,
  '{
    "description": "Hulp bij het oplossen van problematische schulden.",
    "short_description": "Professionele hulp bij schulden",
    "category": "income",
    "requirements": [
      "Je hebt problematische schulden",
      "Je woont in Nederland"
    ],
    "documents_needed": [
      "Overzicht van alle schulden",
      "Inkomensgegevens",
      "Uitgavenoverzicht"
    ],
    "source_url": "https://www.rijksoverheid.nl/schuldhulpverlening",
    "provider": "Gemeente",
    "how_to_apply": "Aanmelden bij de schuldhulpverlening van je gemeente",
    "estimated_amount": "Begeleiding en mogelijke kwijtschelding",
    "impact_score": 8
  }'::jsonb
),

-- 10. Alleenstaande Ouder Kop
(
  'alleenstaande-ouder-kop',
  'Alleenstaande Ouder Kop',
  ARRAY['single_mom', 'single_parent'],
  NULL,
  NULL,
  '{
    "description": "Extra kindgebonden budget voor alleenstaande ouders.",
    "short_description": "Extra toeslag voor alleenstaande ouders",
    "category": "childcare",
    "requirements": [
      "Je bent alleenstaande ouder",
      "Je ontvangt kindgebonden budget",
      "Je hebt geen toeslagpartner"
    ],
    "documents_needed": [
      "Bewijs alleenstaand ouderschap",
      "Kindgebonden budget toekenning"
    ],
    "source_url": "https://www.belastingdienst.nl/kindgebonden-budget",
    "provider": "Belastingdienst",
    "how_to_apply": "Automatisch als je kindgebonden budget ontvangt en alleenstaand bent",
    "estimated_amount": "Tot €3.848 extra per jaar",
    "impact_score": 10
  }'::jsonb
),

-- 11. Participatiewet / Bijstandsuitkering
(
  'bijstandsuitkering',
  'Bijstandsuitkering',
  ARRAY['no_income', 'unemployed', 'single_mom'],
  18,
  NULL,
  '{
    "description": "Maandelijkse uitkering als je geen of onvoldoende inkomen hebt om van te leven.",
    "short_description": "Basisinkomen als je geen werk hebt",
    "category": "income",
    "requirements": [
      "Je hebt geen of te weinig inkomen",
      "Je hebt geen vermogen boven de grens",
      "Je staat ingeschreven als werkzoekende",
      "Je bent bereid om te werken"
    ],
    "documents_needed": [
      "Identiteitsbewijs",
      "Inkomensgegevens",
      "Bankafschriften (3 maanden)",
      "Huurcontract",
      "Bewijs inschrijving UWV"
    ],
    "source_url": "https://www.rijksoverheid.nl/bijstand",
    "provider": "Gemeente",
    "how_to_apply": "Aanvragen bij je gemeente via werk.nl",
    "estimated_amount": "€1.195 - €1.708 per maand (afhankelijk van situatie)",
    "impact_score": 10
  }'::jsonb
),

-- 12. Woonkostentoeslag
(
  'woonkostentoeslag',
  'Woonkostentoeslag',
  ARRAY['low_income', 'high_housing_costs'],
  18,
  NULL,
  '{
    "description": "Extra toeslag als je woonkosten hoger zijn dan normaal bij een laag inkomen.",
    "short_description": "Extra hulp bij hoge woonkosten",
    "category": "housing",
    "requirements": [
      "Je hebt een bijstandsuitkering of laag inkomen",
      "Je woonkosten zijn hoger dan de bijstandsnorm",
      "Je kunt geen goedkopere woning vinden"
    ],
    "documents_needed": [
      "Huurcontract of hypotheekgegevens",
      "Inkomensgegevens",
      "Bewijs zoektocht goedkopere woning"
    ],
    "source_url": "https://www.rijksoverheid.nl/woonkostentoeslag",
    "provider": "Gemeente",
    "how_to_apply": "Aanvragen bij je gemeente",
    "estimated_amount": "Afhankelijk van situatie",
    "impact_score": 6
  }'::jsonb
);

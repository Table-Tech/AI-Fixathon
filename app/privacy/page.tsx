import { Header, Footer } from "@/components/layout";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16 px-4 bg-[var(--muted)]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Privacybeleid
            </h1>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Laatst bijgewerkt: januari 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
            <h2>1. Inleiding</h2>
            <p>
              Hulpwijzer hecht veel waarde aan de bescherming van je
              persoonsgegevens. In dit privacybeleid leggen we uit welke
              gegevens we verzamelen, waarom we dit doen, en hoe we hiermee
              omgaan. Dit beleid is van toepassing op alle diensten van
              Hulpwijzer.
            </p>

            <h2>2. Welke gegevens verzamelen we?</h2>
            <p>We verzamelen de volgende gegevens:</p>
            <ul>
              <li>
                <strong>Contactgegevens:</strong> naam, e-mailadres,
                telefoonnummer
              </li>
              <li>
                <strong>Persoonlijke gegevens:</strong> geboortedatum, adres,
                gezinssituatie
              </li>
              <li>
                <strong>Financiële gegevens:</strong> inkomen, woonsituatie,
                werkstatus
              </li>
              <li>
                <strong>Documenten:</strong> loonstroken, huurcontracten en
                andere bewijsstukken
              </li>
            </ul>

            <h2>3. Waarvoor gebruiken we je gegevens?</h2>
            <p>We gebruiken je gegevens voor:</p>
            <ul>
              <li>Het matchen met relevante regelingen en toeslagen</li>
              <li>Het helpen bij het aanvragen van regelingen</li>
              <li>
                Het verbeteren van onze dienstverlening en AI-aanbevelingen
              </li>
              <li>Contact met je opnemen over je aanvragen</li>
            </ul>

            <h2>4. Delen we je gegevens?</h2>
            <p>
              Wij delen je gegevens nooit met derden zonder je uitdrukkelijke
              toestemming, behalve:
            </p>
            <ul>
              <li>Met vrijwilligers die je aanvraag controleren</li>
              <li>Wanneer we wettelijk verplicht zijn gegevens te delen</li>
              <li>Met verwerkers die namens ons diensten leveren</li>
            </ul>

            <h2>5. Hoe lang bewaren we je gegevens?</h2>
            <p>
              We bewaren je gegevens niet langer dan noodzakelijk voor de
              doeleinden waarvoor ze zijn verzameld. Specifieke bewaartermijnen:
            </p>
            <ul>
              <li>Accountgegevens: tot je je account verwijdert</li>
              <li>
                Aanvraaggegevens: 7 jaar na afronding (wettelijke verplichting)
              </li>
              <li>Chat-gesprekken: 2 jaar na laatste activiteit</li>
            </ul>

            <h2>6. Je rechten</h2>
            <p>Je hebt de volgende rechten:</p>
            <ul>
              <li>Recht op inzage in je gegevens</li>
              <li>Recht op correctie van onjuiste gegevens</li>
              <li>Recht op verwijdering van je gegevens</li>
              <li>Recht op dataportabiliteit</li>
              <li>Recht om bezwaar te maken tegen verwerking</li>
            </ul>

            <h2>7. Beveiliging</h2>
            <p>
              We nemen passende technische en organisatorische maatregelen om je
              gegevens te beschermen. Dit omvat:
            </p>
            <ul>
              <li>Versleuteling van gegevens tijdens transport en opslag</li>
              <li>Regelmatige beveiligingsaudits</li>
              <li>Beperkte toegang tot gegevens op need-to-know basis</li>
              <li>Training van medewerkers en vrijwilligers</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              We gebruiken alleen functionele cookies die noodzakelijk zijn voor
              het functioneren van de website. We gebruiken geen tracking
              cookies of analytics cookies zonder je toestemming.
            </p>

            <h2>9. Contact</h2>
            <p>
              Voor vragen over dit privacybeleid of om je rechten uit te
              oefenen, kun je contact met ons opnemen via:
            </p>
            <p>
              E-mail: privacy@hulpwijzer.nl
              <br />
              Adres: Hulpwijzer, Voorbeeldstraat 1, 1234 AB Amsterdam
            </p>

            <h2>10. Wijzigingen</h2>
            <p>
              We kunnen dit privacybeleid van tijd tot tijd aanpassen. De meest
              recente versie is altijd beschikbaar op deze pagina. Bij
              belangrijke wijzigingen stellen we je hiervan op de hoogte.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

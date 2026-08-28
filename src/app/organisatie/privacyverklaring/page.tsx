import React from "react";

export const metadata = {
  title: "Privacyverklaring",
  description: "Privacyverklaring van UVON Noord-Brabant - Hoe wij omgaan met uw persoonsgegevens.",
};

export default function Privacyverklaring() {
  return (
    <div className="py-16 md:py-24 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-uvon-purple mb-4">
          Privacyverklaring
        </h1>
        <p className="text-sm text-gray-500 mb-8">Laatst bijgewerkt: 15 juni 2026</p>

        <div className="prose prose-purple max-w-none space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Unie van Vrouwelijke Ondernemers (UVON) Noord-Brabant hecht grote waarde aan de bescherming van uw persoonsgegevens. In deze privacyverklaring leggen we uit hoe wij omgaan met persoonsgegevens die wij verzamelen via onze website (https://uvonnoordbrabant.nl) en in het kader van uw lidmaatschap.
          </p>

          <h2 className="font-display text-xl font-bold text-uvon-purple pt-4">1. Persoonsgegevens die wij verwerken</h2>
          <p>
            UVON Noord-Brabant verwerkt persoonsgegevens over u doordat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt. Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Voor- en achternaam</li>
            <li>E-mailadres</li>
            <li>Bedrijfsnaam en branche/sector</li>
            <li>Profielfoto (optioneel, voor de openbare ledenlijst)</li>
            <li>Website en social media links (LinkedIn, Instagram, Facebook)</li>
            <li>Betalingsgegevens (in het kader van inschrijvingen voor bijeenkomsten via Mollie)</li>
            <li>Inloggegevens en wachtwoord (versleuteld, voor het ledenportaal)</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-uvon-purple pt-4">2. Doel en grondslag van de gegevensverwerking</h2>
          <p>
            Wij verwerken uw persoonsgegevens voor de volgende doelen:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Het beheren van uw lidmaatschap en de contributie-inning.</li>
            <li>Het verzenden van uitnodigingen voor onze maandelijkse bijeenkomsten.</li>
            <li>Het afhandelen van uw betalingen voor evenementen via onze betalingspartner Mollie.</li>
            <li>Het tonen van uw ondernemersprofiel op de publieke ledenlijst (indien u lid bent en uw profiel heeft geactiveerd).</li>
            <li>U te kunnen e-mailen indien dit nodig is om onze dienstverlening uit te kunnen voeren.</li>
          </ul>
          <p>
            De juridische grondslag voor deze verwerkingen is het uitvoeren van de overeenkomst (het lidmaatschap) en het voldoen aan wettelijke verplichtingen (zoals onze boekhoudplicht).
          </p>

          <h2 className="font-display text-xl font-bold text-uvon-purple pt-4">3. Delen van persoonsgegevens met derden</h2>
          <p>
            UVON Noord-Brabant verkoopt uw gegevens niet aan derden en verstrekt deze uitsluitend indien dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting. Met bedrijven die uw gegevens verwerken in onze opdracht (zoals onze hostingpartij mijn.host en betalingsverwerker Mollie), sluiten wij een verwerkersovereenkomst om te zorgen voor eenzelfde niveau van beveiliging en vertrouwendheid van uw gegevens.
          </p>

          <h2 className="font-display text-xl font-bold text-uvon-purple pt-4">4. Hoe lang we persoonsgegevens bewaren</h2>
          <p>
            UVON Noord-Brabant bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzamelt. Wij hanteren de volgende bewaartermijnen:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Ledenadministratie:</strong> Tot maximaal 2 jaar na beëindiging van het lidmaatschap, tenzij wettelijke verplichtingen (zoals de fiscale bewaarplicht van 7 jaar) een langere bewaartermijn voorschrijven.</li>
            <li><strong>Evenementregistraties:</strong> Tot 1 jaar na de bijeenkomst, ter evaluatie en administratieve afhandeling.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-uvon-purple pt-4">5. Gegevens inzien, aanpassen of verwijderen</h2>
          <p>
            U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Veel van deze gegevens kunt u zelf beheren en aanpassen via de &quot;Mijn Profiel&quot; pagina in ons ledenportaal. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door UVON Noord-Brabant.
          </p>
          <p>
            U kunt een verzoek tot inzage, correctie, verwijdering of gegevensoverdraging sturen naar <a href="mailto:info@uvonnoordbrabant.nl" className="text-uvon-accent hover:underline">info@uvonnoordbrabant.nl</a>.
          </p>

          <h2 className="font-display text-xl font-bold text-uvon-purple pt-4">6. Beveiliging van uw gegevens</h2>
          <p>
            UVON Noord-Brabant neemt de bescherming van uw gegevens serieus en neemt passende technische en organisatorische maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan. Onze website maakt gebruik van een betrouwbaar SSL-certificaat (HTTPS) en wachtwoorden worden altijd cryptografisch versleuteld opgeslagen.
          </p>
          <p>
            Als u de indruk heeft dat uw gegevens niet goed beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan contact met ons op via <a href="mailto:info@uvonnoordbrabant.nl" className="text-uvon-accent hover:underline">info@uvonnoordbrabant.nl</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

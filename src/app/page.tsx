import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2, Users, Award, Zap } from "lucide-react";

// Force dynamic rendering to always fetch latest events and database changes
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch up to 3 upcoming events from the database
  let upcomingEvents: any[] = [];
  try {
    upcomingEvents = await prisma.event.findMany({
      where: {
        published: true,
        date: {
          // Get events from today onwards (using current local date/time)
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to fetch upcoming events for homepage:", error);
  }

  // Format date helper (Dutch)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-uvon-dark via-uvon-purple to-uvon-dark text-white py-24 md:py-32 overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-uvon-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-uvon-lavender/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-uvon-lavender/10 text-uvon-lavender border border-uvon-lavender/20 mb-6">
              Netwerk voor Ondernemende Vrouwen
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
              Een inspirerend netwerk voor <span className="text-uvon-lavender">ondernemende vrouwen</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              UVON Noord-Brabant is een dynamische, actieve vereniging van vrouwelijke professionals met een eigen bedrijf en directeuren op directieniveau. Ontdek zakelijke vriendschappen, inspiratie en persoonlijke groei.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/evenementen"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-uvon-purple bg-uvon-lavender hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Bekijk onze agenda
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/leden/lid-worden"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                Lid worden
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Strengths / Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-uvon-purple">
              Waarom kiezen voor UVON Noord-Brabant?
            </h2>
            <div className="h-1.5 w-20 bg-uvon-accent rounded-full mx-auto mt-4" />
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Ons netwerk stimuleert persoonlijk ondernemerschap en professionele groei door kennis en ervaringen te delen volgens het principe van &apos;halen en brengen&apos;.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-uvon-light/50 p-8 rounded-2xl border border-uvon-purple/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-uvon-purple text-white flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-uvon-purple mb-3">Dynamisch Netwerk</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Ontmoet tientallen vrouwelijke professionals uit uiteenlopende branches, van startende ondernemers tot ervaren managers op directieniveau.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-uvon-light/50 p-8 rounded-2xl border border-uvon-purple/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-uvon-purple text-white flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-uvon-purple mb-3">Inspirerende Thema&apos;s</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Tijdens bijeenkomsten behandelen we onderwerpen als klantbeloften, strategisch onderhandelen en organiseren we inspirerende bedrijfsbezoeken.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-uvon-light/50 p-8 rounded-2xl border border-uvon-purple/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-uvon-purple text-white flex items-center justify-center mb-6">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-uvon-purple mb-3">Halen & Brengen</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Onze leden dragen actief bij aan de club. We delen kennis en vaardigheden om samen te bouwen aan een beter arbeidsklimaat voor vrouwen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events Teaser */}
      <section className="py-20 bg-uvon-light/30 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-wider text-uvon-accent font-bold">Agenda</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-uvon-purple mt-1">
                Onze komende bijeenkomsten
              </h2>
            </div>
            <Link
              href="/evenementen"
              className="mt-4 md:mt-0 text-sm font-semibold text-uvon-purple hover:text-uvon-accent inline-flex items-center group"
            >
              Bekijk alle bijeenkomsten
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-gray-700">Geen geplande bijeenkomsten</h3>
              <p className="text-gray-500 mt-2 text-sm">
                We zijn momenteel druk bezig met het organiseren van de volgende bijeenkomsten. Kom snel terug!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 group"
                >
                  {/* Image container */}
                  <div className="relative h-48 bg-uvon-purple/5 overflow-hidden">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-uvon-purple/10 to-uvon-accent/10">
                        <Calendar className="h-12 w-12 text-uvon-purple/30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-uvon-purple shadow-sm">
                      {event.price === 0 ? "Gratis" : `€ ${event.price.toFixed(2)}`}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-uvon-purple leading-snug line-clamp-2 mb-4 group-hover:text-uvon-accent transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-uvon-accent shrink-0" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-uvon-accent shrink-0" />
                          <span>{event.startTime} - {event.endTime} uur</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-uvon-accent shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link
                        href={`/evenementen/${event.id}`}
                        className="text-xs sm:text-sm font-semibold text-uvon-purple hover:text-uvon-accent inline-flex items-center group-legacy"
                      >
                        Meer informatie & aanmelden
                        <ArrowRight className="ml-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Brand Quote / Testimonial section */}
      <section className="py-24 bg-gradient-to-br from-uvon-purple to-uvon-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-uvon-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-4xl md:text-5xl font-serif text-uvon-lavender opacity-50 block mb-6">“</span>
          <p className="font-display text-2xl md:text-3xl font-medium italic leading-relaxed text-gray-100">
            Netwerken bij de UVON Noord-Brabant betekent het uitwisselen van kennis en ervaring en een stimulans in persoonlijke ontwikkeling en ondernemerschap.
          </p>
          <div className="h-0.5 w-12 bg-uvon-accent rounded-full mx-auto mt-8 mb-4" />
          <span className="text-sm tracking-wider uppercase font-semibold text-uvon-lavender">
            UVON Noord-Brabant Bestuur
          </span>
        </div>
      </section>

      {/* 5. Become a member highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-uvon-light/40 rounded-3xl p-8 md:p-12 border border-uvon-purple/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-uvon-purple">
                Wil jij deel uitmaken van onze ondernemersvereniging?
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                Ontmoet gelijkgestemde vrouwen, leer van elkaars succes en uitdagingen en breid je netwerk in Noord-Brabant uit. We verwelkomen graag ambitieuze professionals.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center text-sm sm:text-base text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-uvon-accent" />
                  Maandelijkse themabijeenkomsten op wisselende locaties
                </li>
                <li className="flex items-center text-sm sm:text-base text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-uvon-accent" />
                  Toegang tot een uitgebreid en actief ledenportaal
                </li>
                <li className="flex items-center text-sm sm:text-base text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-uvon-accent" />
                  Exclusieve workshops, netwerkborrels en diners
                </li>
              </ul>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-4 w-full sm:w-auto">
              <Link
                href="/leden/lid-worden"
                className="inline-flex justify-center items-center px-6 py-3.5 text-base font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
              >
                Lidmaatschap aanvragen
              </Link>
              <Link
                href="/contact"
                className="inline-flex justify-center items-center px-6 py-3.5 text-base font-semibold text-uvon-purple border border-uvon-purple/20 hover:bg-uvon-light rounded-full transition-colors w-full md:w-auto"
              >
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

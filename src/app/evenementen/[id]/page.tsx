import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import { Calendar, Clock, MapPin, ArrowLeft, Users, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventDetail({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const paymentStatus = resolvedSearchParams.payment;

  let event = null;
  try {
    event = await prisma.event.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to fetch event details:", error);
  }

  if (!event) {
    notFound();
  }

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const isPastEvent = event.date < today;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="py-12 md:py-20 bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/evenementen"
            className="inline-flex items-center text-sm font-semibold text-uvon-accent hover:text-uvon-purple group"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
            Terug naar de agenda
          </Link>
        </div>

        {/* Payment Success/Failure Notification */}
        {paymentStatus === "success" && (
          <div className="mb-8 p-6 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-3xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-emerald-950">Inschrijving geslaagd!</h3>
              <p className="text-sm mt-1">Bedankt voor je inschrijving. De betaling is succesvol verwerkt en er is een bevestigingsmail naar je verzonden.</p>
            </div>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="mb-8 p-6 bg-red-50 text-red-800 border border-red-100 rounded-3xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-red-950">Betaling geannuleerd of mislukt</h3>
              <p className="text-sm mt-1">Het is niet gelukt om de betaling af te ronden. Probeer het opnieuw om je inschrijving voor deze bijeenkomst te voltooien.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Info (60%) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Event Image */}
              <div className="relative h-64 sm:h-96 bg-uvon-purple/5">
                {event.imageUrl ? (
                  <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-uvon-purple/10 to-uvon-accent/10">
                    <Calendar className="h-20 w-20 text-uvon-purple/20" />
                  </div>
                )}
                {isPastEvent && (
                  <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-white shadow-sm">
                    Gearchiveerd / Afgelopen
                  </div>
                )}
              </div>

              {/* Event Metadata Card */}
              <div className="p-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-uvon-light text-uvon-purple border border-uvon-purple/10 mb-4">
                  Maandelijkse bijeenkomst
                </span>

                <h1 className="font-display text-3xl font-extrabold text-uvon-purple leading-tight tracking-tight mb-6">
                  {event.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-gray-50 p-5 rounded-2xl text-sm text-gray-700">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-uvon-accent shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Datum</span>
                      <span className="font-semibold">{formatDate(event.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-uvon-accent shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Tijd</span>
                      <span className="font-semibold">{event.startTime} - {event.endTime} uur</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-uvon-accent shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Locatie</span>
                      <span className="font-semibold line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed space-y-4">
                  <h3 className="font-display text-lg font-bold text-uvon-purple">Programma & Omschrijving</h3>
                  <p className="whitespace-pre-line text-sm sm:text-base">{event.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Column (40%) */}
          <div className="lg:col-span-5 space-y-6">
            {isPastEvent ? (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-gray-700">Bijeenkomst afgelopen</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Deze bijeenkomst heeft al plaatsgevonden op {formatDate(event.date)}. Inschrijven is niet meer mogelijk.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Event Registration Form */}
                <EventRegistrationForm event={{ id: event.id, title: event.title, price: event.price, date: event.date }} />

                {/* Practical Information */}
                <div className="bg-uvon-light/40 p-6 rounded-3xl border border-uvon-purple/5 space-y-4 text-xs sm:text-sm text-gray-600">
                  <h4 className="font-display font-bold text-uvon-purple">Praktische informatie</h4>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2.5 text-uvon-accent shrink-0" />
                    <span>
                      {event.maxParticipants
                        ? `Maximale capaciteit: ${event.maxParticipants} personen`
                        : "Geen maximum aantal deelnemers"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2.5 text-uvon-accent shrink-0" />
                    <span>
                      Veilig betalen via Mollie (iDEAL, Bancontact, Creditcard)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

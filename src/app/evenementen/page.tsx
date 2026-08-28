import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { Calendar, MapPin, Clock, ArrowRight, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bijeenkomsten Agenda",
  description: "Bijeenkomsten en evenementen agenda van UVON Noord-Brabant.",
};

export default async function Agenda() {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      where: {
        published: true,
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch events for agenda page:", error);
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="py-16 md:py-24 bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-xs uppercase tracking-wider text-uvon-accent font-bold">Vereniging</span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-uvon-purple mt-2 tracking-tight">
              Bijeenkomsten & Agenda
            </h1>
            <div className="h-1.5 w-20 bg-uvon-accent rounded-full mt-4" />
          </div>
          <Link
            href="/evenementen/archief"
            className="mt-6 md:mt-0 inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:text-uvon-purple hover:bg-uvon-light rounded-full shadow-sm transition-colors"
          >
            <Archive className="h-4 w-4 mr-2" />
            Bekijk Archief
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-700">Geen bijeenkomsten gepland</h3>
            <p className="text-gray-500 mt-2 text-sm sm:text-base px-4">
              We zijn op dit moment druk bezig met het samenstellen van het programma voor de komende maanden. Bekijk ons archief voor eerdere evenementen of kom binnenkort terug!
            </p>
            <Link
              href="/evenementen/archief"
              className="mt-8 inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full shadow transition-all"
            >
              Bekijk archief
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row"
              >
                {/* Image side */}
                <div className="relative h-64 lg:h-auto lg:w-80 bg-uvon-purple/5 shrink-0">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-uvon-purple/10 to-uvon-accent/10">
                      <Calendar className="h-16 w-16 text-uvon-purple/20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-uvon-purple shadow-sm">
                    {event.price === 0 ? "Gratis" : `€ ${event.price.toFixed(2)}`}
                  </div>
                </div>

                {/* Content side */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-uvon-purple leading-tight mb-4 hover:text-uvon-accent transition-colors">
                      <Link href={`/evenementen/${event.id}`}>{event.title}</Link>
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-uvon-light/30 p-4 rounded-2xl text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2.5 text-uvon-accent shrink-0" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2.5 text-uvon-accent shrink-0" />
                        <span className="font-medium">{event.startTime} - {event.endTime} uur</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2.5 text-uvon-accent shrink-0" />
                        <span className="font-medium line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      {event.maxParticipants ? `Maximaal ${event.maxParticipants} deelnemers` : "Onbeperkt aantal plaatsen"}
                    </span>
                    <Link
                      href={`/evenementen/${event.id}`}
                      className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full shadow transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Aanmelden
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

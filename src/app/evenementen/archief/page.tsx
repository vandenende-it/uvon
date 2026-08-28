import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { Calendar, MapPin, Clock, ArrowLeft, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bijeenkomsten Archief",
  description: "Archief van eerdere bijeenkomsten en evenementen van UVON Noord-Brabant.",
};

export default async function Archief() {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  
  let pastEvents: any[] = [];
  try {
    pastEvents = await prisma.event.findMany({
      where: {
        published: true,
        date: {
          lt: today,
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch past events for archive page:", error);
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-NL", {
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
            <Link
              href="/evenementen"
              className="inline-flex items-center text-sm font-semibold text-uvon-accent hover:text-uvon-purple mb-3 group"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
              Terug naar actuele agenda
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-uvon-purple tracking-tight">
              Archief Bijeenkomsten
            </h1>
            <div className="h-1.5 w-20 bg-uvon-accent rounded-full mt-4" />
          </div>
        </div>

        {pastEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto">
            <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-700">Geen gearchiveerde bijeenkomsten</h3>
            <p className="text-gray-500 mt-2 text-sm sm:text-base px-4">
              Er zijn nog geen bijeenkomsten in het verleden geregistreerd in de database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
              >
                {/* Image container */}
                <div className="relative h-48 bg-uvon-purple/5 overflow-hidden filter grayscale opacity-90">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-uvon-purple/10 to-uvon-accent/10">
                      <Archive className="h-12 w-12 text-uvon-purple/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm">
                    Gearchiveerd
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-uvon-purple leading-snug line-clamp-2 mb-4">
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
                    <p className="text-gray-500 text-xs sm:text-sm mt-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      Prijs: € {event.price.toFixed(2)}
                    </span>
                    <Link
                      href={`/evenementen/${event.id}`}
                      className="text-xs sm:text-sm font-semibold text-uvon-accent hover:text-uvon-purple inline-flex items-center"
                    >
                      Terugblik bekijken
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

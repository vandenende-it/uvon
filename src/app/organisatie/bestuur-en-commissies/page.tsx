import React from "react";
import Image from "next/image";
import { Mail, Linkedin, Users, Calendar, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Bestuur & Commissies",
  description: "Maak kennis met het bestuur en de commissies van UVON Noord-Brabant.",
};

export default function BestuurEnCommissies() {
  const boardMembers = [
    {
      name: "Sabine de Wit",
      role: "Voorzitter",
      company: "De Wit Organisatieadvies",
      description:
        "Sabine leidt de vereniging met een visie op verbinding en groei. Ze zorgt voor de strategische koers en vertegenwoordigt UVON Noord-Brabant naar buiten toe.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      email: "voorzitter@uvonnoordbrabant.nl",
      linkedin: "https://linkedin.com/in/sabine-de-wit",
    },
    {
      name: "Marieke van de Ven",
      role: "Secretaris",
      company: "Van de Ven Consultancy",
      description:
        "Marieke is het aanspreekpunt voor interne communicatie, beheert de notulen en de ledenadministratie. Ze zorgt dat alles binnen de vereniging organisatorisch op rolletjes loopt.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      email: "secretaris@uvonnoordbrabant.nl",
      linkedin: "https://linkedin.com/in/marieke-van-de-ven",
    },
    {
      name: "Esther de Boer",
      role: "Penningmeester",
      company: "De Boer & Partners Advocaten",
      description:
        "Esther draagt zorg voor de financiële gezondheid van de vereniging. Ze beheert de budgetten, de contributie-inning en stelt het financieel jaarverslag op.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      email: "penningmeester@uvonnoordbrabant.nl",
      linkedin: "https://linkedin.com/in/esther-de-boer",
    },
  ];

  const committees = [
    {
      title: "Programmacommissie",
      icon: <Calendar className="h-6 w-6 text-uvon-purple" />,
      description:
        "Verantwoordelijk voor het organiseren van de maandelijkse bijeenkomsten. Zij selecteren de thema's, zoeken inspirerende locaties in Noord-Brabant en stemmen af met gastsprekers.",
      members: "Sandra Janssen (Voorzitter), Marieke van de Ven",
    },
    {
      title: "Ledencommissie",
      icon: <Users className="h-6 w-6 text-uvon-purple" />,
      description:
        "Begeleidt de introductie van nieuwe en potentiële leden. Zij organiseren kennismakingsgesprekken en zorgen ervoor dat nieuwe ondernemers zich snel thuis voelen binnen ons netwerk.",
      members: "Sabine de Wit, Esther de Boer",
    },
    {
      title: "Kascommissie",
      icon: <ShieldCheck className="h-6 w-6 text-uvon-purple" />,
      description:
        "Controleert jaarlijks de boeken en het financieel beheer van de penningmeester ter voorbereiding op de Algemene Ledenvergadering (ALV).",
      members: "Wisselende bezetting van twee leden",
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-wider text-uvon-accent font-bold">Organisatie</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-uvon-purple mt-2 tracking-tight">
            Bestuur & Commissies
          </h1>
          <div className="h-1.5 w-20 bg-uvon-accent rounded-full mx-auto mt-4" />
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            De UVON Noord-Brabant wordt bestuurd door een enthousiast team van vrouwelijke ondernemers die zich naast hun eigen bedrijf inzetten voor het netwerk. Maak hieronder kennis met ons bestuur en de actieve commissies.
          </p>
        </div>

        {/* Board Members Section */}
        <div className="mb-24">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-uvon-purple mb-10 text-center md:text-left">
            Het Dagelijks Bestuur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boardMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <div className="relative h-64 bg-uvon-purple/5">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                    <div className="absolute bottom-4 left-4 bg-uvon-purple text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      {member.role}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-uvon-purple">{member.name}</h3>
                    <p className="text-sm font-medium text-uvon-accent mt-0.5">{member.company}</p>
                    <p className="text-gray-600 text-sm mt-4 leading-relaxed">{member.description}</p>
                  </div>
                </div>
                {/* Contact Links */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center gap-4 text-gray-500 text-sm">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center hover:text-uvon-purple transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-1.5" />
                    E-mail
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-uvon-purple transition-colors ml-auto"
                  >
                    <Linkedin className="h-4 w-4 mr-1.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Committees Section */}
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-uvon-purple mb-10 text-center md:text-left">
            Onze Commissies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {committees.map((committee) => (
              <div
                key={committee.title}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-uvon-light flex items-center justify-center mb-6">
                    {committee.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-uvon-purple mb-3">
                    {committee.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    {committee.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Commissieleden
                  </span>
                  <span className="text-sm font-medium text-uvon-purple mt-1 block">
                    {committee.members}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

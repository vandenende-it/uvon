"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Globe, Linkedin, Users, Filter } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  businessSector: string | null;
  description: string | null;
  photoUrl: string | null;
  website: string | null;
  linkedin: string | null;
}

interface MembersListProps {
  initialMembers: Member[];
}

export default function MembersList({ initialMembers }: MembersListProps) {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  // Get unique list of sectors for filter dropdown
  const sectors = useMemo(() => {
    const list = initialMembers
      .map((m) => m.businessSector)
      .filter((s): s is string => !!s);
    return Array.from(new Set(list)).sort();
  }, [initialMembers]);

  // Filter members based on search term and selected sector
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      const matchSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        (member.companyName && member.companyName.toLowerCase().includes(search.toLowerCase())) ||
        (member.description && member.description.toLowerCase().includes(search.toLowerCase()));

      const matchSector = selectedSector === "" || member.businessSector === selectedSector;

      return matchSearch && matchSector;
    });
  }, [initialMembers, search, selectedSector]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-grow relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Zoek op naam, bedrijf of omschrijving..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm bg-gray-50/50"
          />
        </div>

        {/* Sector Filter Dropdown */}
        <div className="w-full md:w-64 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Filter className="h-4 w-4" />
          </span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm bg-gray-50/50 appearance-none cursor-pointer"
          >
            <option value="">Alle Sectoren</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Count */}
      <div className="text-sm text-gray-500 pl-2">
        {filteredMembers.length === 0 ? (
          "Geen leden gevonden die voldoen aan de zoekcriteria."
        ) : (
          <>
            {filteredMembers.length} {filteredMembers.length === 1 ? "lid" : "leden"} gevonden.
          </>
        )}
      </div>

      {/* Grid of Member Cards */}
      {filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6 sm:p-8">
                {/* Profile Photo & Name Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-uvon-lavender shrink-0 bg-uvon-purple/5">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-uvon-purple/10 text-uvon-purple font-semibold text-lg uppercase">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-uvon-purple leading-snug">
                      {member.name}
                    </h3>
                    {member.companyName && (
                      <span className="text-sm font-semibold text-uvon-accent block mt-0.5">
                        {member.companyName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sector Badge */}
                {member.businessSector && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-uvon-light text-uvon-purple border border-uvon-purple/5 mb-4">
                    {member.businessSector}
                  </span>
                )}

                {/* Biography */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mt-2">
                  {member.description || "Geen introductie opgegeven."}
                </p>
              </div>

              {/* Social / Contact Links Footer */}
              <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                {member.website && (
                  <a
                    href={member.website.startsWith("http") ? member.website : `https://${member.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-gray-500 hover:text-uvon-purple border border-gray-100 hover:border-uvon-purple/20 rounded-full shadow-sm transition-all"
                    title="Website bezoeken"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-gray-500 hover:text-uvon-purple border border-gray-100 hover:border-uvon-purple/20 rounded-full shadow-sm transition-all"
                    title="LinkedIn Profiel"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {(!member.website && !member.linkedin) && (
                  <span className="text-xs text-gray-400 flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    UVON lid
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

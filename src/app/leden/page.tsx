import React from "react";
import prisma from "@/lib/db";
import MembersList from "@/components/MembersList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ledenoverzicht",
  description: "Maak kennis met de ondernemende vrouwen en professionals aangesloten bij UVON Noord-Brabant.",
};

export default async function LedenOverzicht() {
  let members: any[] = [];
  try {
    // Fetch users whose role is MEMBER or ADMIN, and exclude users pending approval
    members = await prisma.user.findMany({
      where: {
        passwordHash: {
          not: "DEACTIVATED_PENDING_APPROVAL",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        businessSector: true,
        description: true,
        photoUrl: true,
        website: true,
        linkedin: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch members for directory page:", error);
  }

  return (
    <div className="py-16 md:py-24 bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-uvon-accent font-bold">Vereniging</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-uvon-purple mt-2 tracking-tight">
            Ledenoverzicht
          </h1>
          <div className="h-1.5 w-20 bg-uvon-accent rounded-full mx-auto mt-4" />
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Maak kennis met de getalenteerde en ondernemende vrouwen aangesloten bij ons Brabantse netwerk. Zoek op naam of bedrijf of filter op sector.
          </p>
        </div>

        {/* Interactive List Wrapper */}
        <MembersList initialMembers={members} />
      </div>
    </div>
  );
}

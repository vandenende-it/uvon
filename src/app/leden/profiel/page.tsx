import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import ProfileEditForm from "@/components/ProfileEditForm";
import { FileText, Download, ShieldAlert, Award, Calendar, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mijn Profiel & Portaal",
  description: "Het ledenportaal van UVON Noord-Brabant - Beheer uw gegevens en download documenten.",
};

export default async function ProfielPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/leden/login");
  }

  // Fetch complete user details
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!dbUser) {
    redirect("/leden/login");
  }

  // Fetch secure documents for members
  let documents: any[] = [];
  try {
    documents = await prisma.document.findMany({
      orderBy: { uploadedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch documents for profile page:", error);
  }

  // Fetch registrations for the logged-in member to show their event attendance history
  let registrations: any[] = [];
  try {
    registrations = await prisma.registration.findMany({
      where: { userId: dbUser.id },
      include: {
        event: true,
      },
      orderBy: {
        event: {
          date: "desc",
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch registrations for profile page:", error);
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="py-12 md:py-20 bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-uvon-purple to-uvon-dark rounded-3xl p-8 md:p-12 text-white shadow-md mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-uvon-lavender font-bold">Ledenportaal</span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">
              Welkom terug, {dbUser.name}!
            </h1>
            <p className="text-sm md:text-base text-uvon-lavender/80 mt-2">
              Rol: <span className="font-semibold text-white">{dbUser.role === "ADMIN" ? "Bestuurslid / Administrator" : "Verenigingslid"}</span>
            </p>
          </div>
          {dbUser.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center px-5 py-3 text-sm font-semibold text-uvon-purple bg-white hover:bg-uvon-lavender rounded-xl shadow transition-colors shrink-0"
            >
              Naar Admin Dashboard
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Profile Edit Form Column (60-70%) */}
          <div className="lg:col-span-7 space-y-6">
            <ProfileEditForm user={dbUser} />
          </div>

          {/* Documents & History Column (30-40%) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Secured Document Download area */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display text-lg font-bold text-uvon-purple mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-uvon-accent" />
                Interne Documenten & Notulen
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Exclusief beschikbaar voor ingelogde leden. Hier vind je notulen van ALV&apos;s en financiële jaarstukken.
              </p>

              {documents.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-center border border-gray-100">
                  <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Er zijn nog geen documenten geüpload.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-uvon-light/30 border border-gray-100 rounded-2xl transition-colors group"
                    >
                      <div className="min-w-0 pr-4">
                        <span className="text-xs font-semibold text-uvon-accent uppercase tracking-wider block">
                          {doc.category === "MINUTES" ? "Notulen" : doc.category === "FINANCIAL" ? "Financieel" : "Overig"}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5 group-hover:text-uvon-purple transition-colors">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Toegevoegd op {formatDate(doc.uploadedAt)}
                        </span>
                      </div>
                      <a
                        href={doc.fileUrl}
                        download
                        className="p-2 bg-white text-gray-500 hover:text-uvon-purple hover:bg-uvon-light border border-gray-100 rounded-xl transition-all shadow-sm shrink-0"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Event attendance history */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display text-lg font-bold text-uvon-purple mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-uvon-accent" />
                Mijn Aanmeldingen
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Een overzicht van bijeenkomsten waarvoor je je hebt ingeschreven en de betalingsstatus.
              </p>

              {registrations.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-center border border-gray-100">
                  <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Je hebt je nog niet ingeschreven voor bijeenkomsten.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between text-sm"
                    >
                      <div className="min-w-0 pr-4">
                        <span className="font-semibold text-gray-800 line-clamp-1">
                          {reg.event.title}
                        </span>
                        <span className="text-xs text-gray-500 block mt-0.5">
                          {formatDate(reg.event.date)}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                          reg.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : reg.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {reg.status === "PAID" ? "Betaald" : reg.status === "PENDING" ? "In afwachting" : "Mislukt"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple dynamic import link logic helper
import Link from "next/link";

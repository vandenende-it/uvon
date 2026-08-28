import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Beheer Dashboard",
  description: "Beheeromgeving voor bestuursleden van UVON Noord-Brabant.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Secure checks
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/leden/login");
  }

  // Fetch initial data for dashboard in parallel/sequential
  let users: any[] = [];
  let events: any[] = [];
  let registrations: any[] = [];
  let documents: any[] = [];

  try {
    users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });

    events = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });

    registrations = await prisma.registration.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    documents = await prisma.document.findMany({
      orderBy: { uploadedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch initial admin dashboard data:", error);
  }

  return (
    <div className="flex flex-col flex-grow">
      {/* Visual top bar title */}
      <div className="bg-uvon-purple text-white py-6 border-b border-uvon-dark/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            Bestuur & Beheer Portaal
          </h1>
          <span className="text-xs sm:text-sm text-uvon-lavender font-medium bg-white/10 px-3.5 py-1.5 rounded-full">
            Ingelogd als: <span className="text-white font-semibold">{session.user.name}</span>
          </span>
        </div>
      </div>

      <AdminDashboard
        initialUsers={users}
        initialEvents={events}
        initialRegistrations={registrations}
        initialDocuments={documents}
      />
    </div>
  );
}

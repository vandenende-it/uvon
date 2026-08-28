import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// Helper to verify admin session
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return false;
  }
  return true;
}

// GET: Fetch all events
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Admin GET events error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// POST: Create a new event
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, date, startTime, endTime, location, price, maxParticipants, imageUrl, published } = body;

    if (!title || !description || !date || !startTime || !endTime || !location) {
      return NextResponse.json({ error: "Vul a.u.b. alle verplichte velden in." }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        price: Number(price) || 0.0,
        maxParticipants: maxParticipants ? Number(maxParticipants) : null,
        imageUrl: imageUrl || null,
        published: published ?? false,
      },
    });

    console.log(`[Admin Created Event] ${newEvent.title}`);
    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Admin POST event error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// PUT: Update event
export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, description, date, startTime, endTime, location, price, maxParticipants, imageUrl, published } = body;

    if (!id || !title || !description || !date || !startTime || !endTime || !location) {
      return NextResponse.json({ error: "Vul a.u.b. alle verplichte velden in." }, { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        price: Number(price) || 0.0,
        maxParticipants: maxParticipants ? Number(maxParticipants) : null,
        imageUrl: imageUrl || null,
        published: published ?? false,
      },
    });

    console.log(`[Admin Updated Event] ${updatedEvent.title}`);
    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Admin PUT event error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// DELETE: Delete an event
export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Evenement ID ontbreekt." }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    console.log(`[Admin Deleted Event] ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE event error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

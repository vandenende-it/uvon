import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

// Helper to verify admin session
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return false;
  }
  return true;
}

// GET: Fetch all users
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin GET members error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// POST: Create/Add a new member directly (solves the cumbersome WordPress process)
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, companyName, businessSector, website, linkedin, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Naam, e-mailadres en wachtwoord zijn verplichte velden." }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Er bestaat al een account met dit e-mailadres." }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        companyName: companyName || null,
        businessSector: businessSector || null,
        website: website || null,
        linkedin: linkedin || null,
        role: role || "MEMBER",
      },
    });

    console.log(`[Admin Created Member] ${newUser.name} (${newUser.email})`);
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Admin POST member error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// PUT: Update user (including approving pending members)
export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, email, password, companyName, businessSector, website, linkedin, role } = body;

    if (!id || !name || !email) {
      return NextResponse.json({ error: "ID, naam en e-mailadres zijn verplichte velden." }, { status: 400 });
    }

    const updateData: any = {
      name,
      email,
      companyName: companyName || null,
      businessSector: businessSector || null,
      website: website || null,
      linkedin: linkedin || null,
      role: role || "MEMBER",
    };

    // If new password is provided, hash and update it
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json({ error: "Wachtwoord moet minimaal 6 tekens bevatten." }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    console.log(`[Admin Updated Member] ${updatedUser.name} (${updatedUser.email})`);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin PUT member error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Gebruikers ID ontbreekt." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    console.log(`[Admin Deleted Member] ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE member error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

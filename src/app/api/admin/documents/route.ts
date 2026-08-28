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

// GET: Fetch all documents
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const documents = await prisma.document.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Admin GET documents error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// POST: Add a new document record
export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, fileUrl, category } = body;

    if (!title || !fileUrl || !category) {
      return NextResponse.json({ error: "Titel, document-link en categorie zijn verplichte velden." }, { status: 400 });
    }

    const newDoc = await prisma.document.create({
      data: {
        title,
        fileUrl,
        category,
      },
    });

    console.log(`[Admin Uploaded Document] ${newDoc.title}`);
    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    console.error("Admin POST document error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

// DELETE: Delete a document record
export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID ontbreekt." }, { status: 400 });
    }

    await prisma.document.delete({
      where: { id },
    });

    console.log(`[Admin Deleted Document] ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE document error:", error);
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

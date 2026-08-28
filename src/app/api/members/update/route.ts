import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Niet geautoriseerd. Log in om uw profiel bij te werken." }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      companyName,
      businessSector,
      description,
      photoUrl,
      website,
      linkedin,
      currentPassword,
      newPassword,
    } = body;

    // Validate inputs
    if (!name) {
      return NextResponse.json({ error: "Naam is een verplicht veld." }, { status: 400 });
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      name,
      companyName: companyName || null,
      businessSector: businessSector || null,
      description: description || null,
      photoUrl: photoUrl || null,
      website: website || null,
      linkedin: linkedin || null,
    };

    // Process password change if requested
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Vul zowel uw huidige als nieuwe wachtwoord in om uw wachtwoord te wijzigen." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Het nieuwe wachtwoord moet minimaal 6 tekens bevatten." }, { status: 400 });
      }

      // Verify current password (if user had no password set, passwordHash will be "DEACTIVATED_PENDING_APPROVAL" or similar, but active users must have valid hashes)
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ error: "Het huidige wachtwoord is onjuist." }, { status: 400 });
      }

      // Hash and update new password
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    console.log(`[Profile Update Success] User: ${updatedUser.name} (${updatedUser.email})`);

    return NextResponse.json({
      success: true,
      message: "Profiel succesvol bijgewerkt.",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Er is een serverfout opgetreden bij het bijwerken van uw profiel." },
      { status: 500 }
    );
  }
}

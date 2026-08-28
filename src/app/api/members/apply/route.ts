import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, companyName, businessSector, website, linkedin, description } = body;

    // Validation
    if (!name || !email || !phone || !companyName || !businessSector || !description) {
      return NextResponse.json({ error: "Alle verplichte velden moeten worden ingevuld." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Er bestaat al een account met dit e-mailadres." },
        { status: 400 }
      );
    }

    // Insert user into database with a deactivated password hash
    // The string "DEACTIVATED_PENDING_APPROVAL" is not a valid bcrypt hash,
    // so it is cryptographically impossible for this user to log in until an admin sets a password.
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: "DEACTIVATED_PENDING_APPROVAL",
        name,
        companyName,
        businessSector,
        description,
        website,
        linkedin,
        role: "MEMBER",
      },
    });

    console.log(`[New Membership Application] User: ${name} (${email}) for company: ${companyName}`);

    // Send admin notification email
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_EMAIL_TO } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          password: SMTP_PASSWORD,
        },
      } as any);

      const adminEmail = CONTACT_EMAIL_TO || "info@uvonnoordbrabant.nl";

      const mailOptions = {
        from: `"UVON Website" <${SMTP_USER}>`,
        to: adminEmail,
        subject: `Nieuwe lidmaatschapsaanvraag: ${name}`,
        text: `Nieuwe aanmelding ontvangen!\n\nNaam: ${name}\nE-mailadres: ${email}\nTelefoonnummer: ${phone}\nBedrijfsnaam: ${companyName}\nSector: ${businessSector}\nWebsite: ${website}\nLinkedIn: ${linkedin}\n\nOmschrijving:\n${description}`,
        html: `
          <h3>Nieuwe lidmaatschapsaanvraag via de website</h3>
          <p>Er is een nieuwe aanmelding binnengekomen die goedkeuring vereist in het admin dashboard.</p>
          <hr/>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>E-mailadres:</strong> ${email}</p>
          <p><strong>Telefoonnummer:</strong> ${phone}</p>
          <p><strong>Bedrijf:</strong> ${companyName}</p>
          <p><strong>Sector:</strong> ${businessSector}</p>
          <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
          <p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>
          <br/>
          <p><strong>Bedrijfsomschrijving / Motivatie:</strong></p>
          <p style="white-space: pre-line;">${description}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({
      success: true,
      message: "Aanmelding succesvol verwerkt.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Error handling membership application:", error);
    return NextResponse.json(
      { error: "Er is een serverfout opgetreden bij het verwerken van uw aanmelding." },
      { status: 500 }
    );
  }
}

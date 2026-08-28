import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createMollieClient } from "@mollie/api-client";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const paymentId = formData.get("id") as string;

    if (!paymentId) {
      return new Response("Missing payment ID", { status: 400 });
    }

    console.log(`[Mollie Webhook Received] Payment ID: ${paymentId}`);

    const mollieApiKey = process.env.MOLLIE_API_KEY;
    if (!mollieApiKey) {
      return new Response("Mollie API key not configured", { status: 500 });
    }

    const mollieClient = createMollieClient({ apiKey: mollieApiKey });
    const payment = await mollieClient.payments.get(paymentId);

    // Extract registrationId from payment metadata
    const registrationId = (payment.metadata as any)?.registrationId;

    if (!registrationId) {
      console.error("Mollie payment metadata is missing registrationId.");
      return new Response("Missing metadata", { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        user: true,
      },
    });

    if (!registration) {
      console.error(`Registration ${registrationId} not found in database.`);
      return new Response("Registration not found", { status: 404 });
    }

    // Process payment status
    if (payment.status === "paid") {
      // Update registration to PAID
      await prisma.registration.update({
        where: { id: registrationId },
        data: { status: "PAID" },
      });

      console.log(`[Webhook Success] Registration ${registrationId} marked as PAID.`);

      // Send confirmation email
      await sendConfirmationEmail(
        registration.user.name,
        registration.user.email,
        registration.event.title,
        registration.event.location,
        registration.event.date
      );
    } else if (payment.status === "failed" || payment.status === "canceled" || payment.status === "expired") {
      // Update registration to FAILED
      await prisma.registration.update({
        where: { id: registrationId },
        data: { status: "FAILED" },
      });
      console.log(`[Webhook Failed] Registration ${registrationId} marked as FAILED.`);
    }

    // Always respond with 200 OK to Mollie
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error handling Mollie webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// SMTP Mail confirmation copy from main register route
async function sendConfirmationEmail(name: string, email: string, eventTitle: string, location: string, date: Date) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          password: SMTP_PASSWORD,
        },
      } as any);

      const formattedDate = date.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await transporter.sendMail({
        from: `"UVON Noord-Brabant" <${SMTP_USER}>`,
        to: email,
        subject: `Bevestiging aanmelding: ${eventTitle}`,
        text: `Beste ${name},\n\nJe bent succesvol aangemeld voor de bijeenkomst "${eventTitle}".\n\nDetails:\nDatum: ${formattedDate}\nLocatie: ${location}\n\nWe kijken uit naar je komst!\n\nMet vriendelijke groet,\nBestuur UVON Noord-Brabant`,
        html: `
          <h3>Aanmeldingsbevestiging bijeenkomst</h3>
          <p>Beste <strong>${name}</strong>,</p>
          <p>Je bent succesvol aangemeld voor de bijeenkomst:</p>
          <blockquote style="font-size: 16px; font-weight: bold; color: #270d36; padding: 10px; border-left: 4px solid #ead5ff; background: #f9f6fc; margin: 15px 0;">
            ${eventTitle}
          </blockquote>
          <p><strong>Datum:</strong> ${formattedDate}</p>
          <p><strong>Locatie:</strong> ${location}</p>
          <br/>
          <p>We kijken uit naar je komst!</p>
          <br/>
          <p>Met vriendelijke groet,</p>
          <p><strong>Bestuur UVON Noord-Brabant</strong></p>
        `,
      });
      console.log(`Confirmation email sent to ${email}`);
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  } else {
    console.log(`[MOCK EMAIL SENT] To: ${email} | Subject: Bevestiging aanmelding: ${eventTitle}`);
  }
}

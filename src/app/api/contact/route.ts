import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Simple validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Alle verplichte velden moeten worden ingevuld." }, { status: 400 });
    }

    console.log(`[Contact Form Submission] From: ${name} <${email}> | Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Check if SMTP is configured in environment variables
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_EMAIL_TO } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: SMTP_USER,
          password: SMTP_PASSWORD,
        },
      } as any);

      const mailOptions = {
        from: `"${name} via UVON Website" <${SMTP_USER}>`,
        replyTo: email,
        to: CONTACT_EMAIL_TO || "info@uvonnoordbrabant.nl",
        subject: `Contactformulier: ${subject}`,
        text: `Naam: ${name}\nE-mailadres: ${email}\nOnderwerp: ${subject}\n\nBericht:\n${message}`,
        html: `
          <h3>Nieuw bericht via het contactformulier</h3>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>E-mailadres:</strong> ${email}</p>
          <p><strong>Onderwerp:</strong> ${subject}</p>
          <br/>
          <p><strong>Bericht:</strong></p>
          <p style="white-space: pre-line;">${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully via Nodemailer.");
    } else {
      console.warn("SMTP configuration is missing. Logging email instead of sending.");
      // Simulating slight delay for user experience in mock mode
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return NextResponse.json({ success: true, message: "Bericht succesvol verzonden." });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    return NextResponse.json({ error: "Er is een serverfout opgetreden bij het verzenden van het bericht." }, { status: 500 });
  }
}

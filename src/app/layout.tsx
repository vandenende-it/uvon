import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | UVON Noord-Brabant",
    default: "UVON Noord-Brabant | Netwerk voor Ondernemende Vrouwen",
  },
  description:
    "UVON Noord-Brabant is een dynamisch en actief netwerk van vrouwelijke ondernemers en professionals. Ontdek onze maandelijkse netwerkbijeenkomsten, ontmoet ambitieuze vrouwen en deel kennis.",
  keywords: ["UVON", "Noord-Brabant", "vrouwelijke ondernemers", "netwerk", "bijeenkomsten", "ondernemen"],
  authors: [{ name: "UVON Noord-Brabant" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <SessionProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

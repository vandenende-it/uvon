import React from "react";
import Link from "next/link";
import { Mail, Landmark, FileText, Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-uvon-dark text-gray-300 border-t border-uvon-purple/20">
      {/* Top CTA Section */}
      <div className="bg-gradient-to-r from-uvon-purple to-uvon-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">Lid worden van ons netwerk?</h3>
            <p className="text-uvon-lavender mt-1 text-sm md:text-base">
              Ben jij onderneemster of een ondernemende zakenvrouw en spreekt UVON Noord-Brabant je aan?
            </p>
          </div>
          <Link
            href="/leden/lid-worden"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-uvon-purple bg-uvon-lavender hover:bg-white rounded-full shadow transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Lees meer & Meld je aan
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <span className="font-display text-2xl font-bold text-white tracking-tight">
              UVON <span className="text-uvon-accent">Noord-Brabant</span>
            </span>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
              Een inspirerend en dynamisch netwerk voor ondernemende vrouwen. Wij bieden onderlinge contacten, inspiratie en ontspanning via onze maandelijkse netwerkbijeenkomsten.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://www.facebook.com/UVON-Noord-Brabant-257162547696748/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-uvon-purple/30 text-uvon-lavender hover:text-white hover:bg-uvon-purple/50 rounded-full transition-all duration-300"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/groups/2526552/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-uvon-purple/30 text-uvon-lavender hover:text-white hover:bg-uvon-purple/50 rounded-full transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/uvon_noordbrabant/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-uvon-purple/30 text-uvon-lavender hover:text-white hover:bg-uvon-purple/50 rounded-full transition-all duration-300"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Navigatie</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-uvon-lavender transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/organisatie/bestuur-en-commissies" className="hover:text-uvon-lavender transition-colors">Bestuur & Commissies</Link>
              </li>
              <li>
                <Link href="/evenementen" className="hover:text-uvon-lavender transition-colors">Bijeenkomsten</Link>
              </li>
              <li>
                <Link href="/leden" className="hover:text-uvon-lavender transition-colors">Ledenoverzicht</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-uvon-lavender transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Administrative Details */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Contact & Info</h4>
            <ul className="mt-4 space-y-3.5 text-sm text-gray-400">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-uvon-accent shrink-0" />
                <a href="mailto:info@uvonnoordbrabant.nl" className="hover:text-white transition-colors">
                  info@uvonnoordbrabant.nl
                </a>
              </li>
              <li className="flex items-start">
                <Landmark className="h-4 w-4 mr-2 text-uvon-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-300">ING Bank</span>
                  <p className="text-xs mt-0.5">NL13 ING B 0688 706 673</p>
                </div>
              </li>
              <li className="flex items-start">
                <FileText className="h-4 w-4 mr-2 text-uvon-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-300">Kamer van Koophandel</span>
                  <p className="text-xs mt-0.5">KvK: 171 41 161</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-uvon-purple/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} UVON Noord-Brabant. Alle rechten voorbehouden.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/organisatie/privacyverklaring" className="hover:text-gray-400 transition-colors">
              Privacyverklaring
            </Link>
            <a href="#" className="hover:text-gray-400 transition-colors">Algemene Voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

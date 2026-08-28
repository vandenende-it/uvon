"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, Lock } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const { data: session } = useSession();

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Organisatie",
      dropdown: [
        { name: "Bestuur & Commissies", href: "/organisatie/bestuur-en-commissies" },
        { name: "Privacyverklaring", href: "/organisatie/privacyverklaring" },
      ],
    },
    {
      name: "Bijeenkomsten",
      dropdown: [
        { name: "Agenda", href: "/evenementen" },
        { name: "Archief", href: "/evenementen/archief" },
      ],
    },
    {
      name: "Leden",
      dropdown: [
        { name: "Ledenoverzicht", href: "/leden" },
        { name: "Lid Worden", href: "/leden/lid-worden" },
        ...(!session
          ? [{ name: "Inloggen", href: "/leden/login" }]
          : [
              { name: "Mijn Profiel", href: "/leden/profiel" },
              ...((session?.user as any)?.role === "ADMIN" ? [{ name: "Beheer", href: "/admin" }] : []),
            ]),
      ],
    },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-uvon-purple">
                UVON
              </span>
              <span className="text-[10px] uppercase tracking-wider text-uvon-accent font-semibold -mt-1">
                Noord-Brabant
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="relative group">
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-uvon-purple rounded-md transition-colors"
                  >
                    {link.name}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute right-0 w-56 mt-1 origin-top-right bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1">
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-uvon-light hover:text-uvon-purple transition-colors"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? "text-uvon-purple bg-uvon-light"
                      : "text-gray-700 hover:text-uvon-purple hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}

            {/* CTA / Auth Button */}
            <div className="ml-4 flex items-center space-x-2">
              {session ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/leden/profiel"
                    className="flex items-center text-sm font-medium text-uvon-purple hover:text-uvon-accent px-3 py-2 rounded-md hover:bg-uvon-light transition-colors"
                  >
                    <User className="h-4 w-4 mr-1" />
                    {((session?.user as any)?.name || "").split(" ")[0]}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-50 transition-colors"
                    title="Uitloggen"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/leden/lid-worden"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Lid worden
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-uvon-purple hover:bg-uvon-light focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 max-h-screen ${
          isOpen ? "block border-b border-gray-100 bg-white" : "hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.name} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(link.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-uvon-purple hover:bg-uvon-light transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      activeDropdown === link.name ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === link.name && (
                  <div className="pl-4 space-y-1 bg-uvon-light/30 py-1 rounded-md">
                    {link.dropdown.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-uvon-purple transition-colors"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "text-uvon-purple bg-uvon-light"
                    : "text-gray-700 hover:text-uvon-purple hover:bg-uvon-light"
                }`}
              >
                {link.name}
              </Link>
            )
          )}

          {/* Mobile Auth/CTA */}
          <div className="pt-4 pb-2 border-t border-gray-100 px-3">
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
                  <User className="h-5 w-5 mr-2 text-uvon-purple" />
                  Ingelogd als: <span className="font-semibold ml-1 text-uvon-purple">{(session?.user as any)?.name}</span>
                </div>
                {((session?.user as any)?.role === "ADMIN") && (
                  <Link
                    href="/admin"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-uvon-purple hover:bg-uvon-light transition-colors"
                  >
                    <Lock className="h-5 w-5 mr-2 text-uvon-purple" />
                    Admin Beheer
                  </Link>
                )}
                <Link
                  href="/leden/profiel"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-uvon-purple hover:bg-uvon-light transition-colors"
                >
                  <User className="h-5 w-5 mr-2 text-uvon-purple" />
                  Mijn Profiel
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center px-3 py-2.5 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Uitloggen
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/leden/login"
                  className="block w-full text-center px-4 py-2.5 text-base font-semibold text-uvon-purple border border-uvon-purple hover:bg-uvon-light rounded-full transition-colors"
                >
                  Inloggen
                </Link>
                <Link
                  href="/leden/lid-worden"
                  className="block w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full transition-colors"
                >
                  Lid worden
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

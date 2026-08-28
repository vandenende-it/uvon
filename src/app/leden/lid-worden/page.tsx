"use client";

import React, { useState } from "react";
import { Check, Send, CheckCircle2, AlertCircle, Sparkles, Building2, User, HelpCircle } from "lucide-react";

export default function LidWorden() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    businessSector: "",
    website: "",
    linkedin: "",
    description: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Aanmelding wordt verwerkt..." });

    try {
      const response = await fetch("/api/members/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Je aanmelding is succesvol ontvangen! Het bestuur neemt zo snel mogelijk contact met je op voor een kennismaking.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          businessSector: "",
          website: "",
          linkedin: "",
          description: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Er is iets misgegaan. Probeer het later opnieuw.",
        });
      }
    } catch (error) {
      console.error("Failed to submit membership application:", error);
      setStatus({
        type: "error",
        message: "Kon geen verbinding maken met de server. Probeer het later opnieuw.",
      });
    }
  };

  const benefits = [
    "Uitbreiding van je zakelijke en persoonlijke netwerk in Noord-Brabant",
    "Maandelijkse bijeenkomsten met inspirerende sprekers en themadiscussies",
    "Toegang tot ons exclusieve ledenportaal en online ledenlijst",
    "Mogelijkheid om je bedrijf te presenteren aan andere leden",
    "Inspirerende bedrijfsbezoeken aan toonaangevende Brabantse ondernemingen",
    "Gezamenlijke diners, informele netwerkborrels en het jaarlijkse kerstdiner",
  ];

  return (
    <div className="py-16 md:py-24 bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-uvon-accent font-bold">Netwerk</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-uvon-purple mt-2 tracking-tight">
            Lid worden van UVON
          </h1>
          <div className="h-1.5 w-20 bg-uvon-accent rounded-full mx-auto mt-4" />
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Spreekt ons netwerk van ambitieuze en ondernemende vrouwen je aan? Lees hieronder meer over de voorwaarden en meld je direct aan als lid of kom een keer sfeer proeven als gast!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          {/* Information Column (40%) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Membership Benefits */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display text-xl font-bold text-uvon-purple flex items-center mb-6">
                <Sparkles className="h-5 w-5 text-uvon-accent mr-2" />
                Wat biedt UVON jou?
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start text-sm sm:text-base text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-uvon-light flex items-center justify-center text-uvon-purple shrink-0 mr-3 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dues & Requirements */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h4 className="font-display text-lg font-bold text-uvon-purple flex items-center mb-2">
                  <Building2 className="h-5 w-5 text-uvon-accent mr-2" />
                  Voor wie?
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  UVON Noord-Brabant staat open voor vrouwelijke ondernemers, zelfstandig professionals met een eigen onderneming, en vrouwen met een directie- of sleutelfunctie binnen organisaties in Noord-Brabant.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-display text-lg font-bold text-uvon-purple flex items-center mb-2">
                  <User className="h-5 w-5 text-uvon-accent mr-2" />
                  Contributie
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Het lidmaatschap bedraagt € 150 per kalenderjaar. Hiervoor krijg je toegang tot alle reguliere bijeenkomsten. Voor diners of speciale events kan een eigen bijdrage (bijvoorbeeld € 75) gevraagd worden.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-display text-lg font-bold text-uvon-purple flex items-center mb-2">
                  <HelpCircle className="h-5 w-5 text-uvon-accent mr-2" />
                  Sfeer proeven als gast?
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Wil je eerst een keer meemaken hoe een bijeenkomst verloopt? Je kunt je via onze agenda aanmelden als gast voor een bijeenkomst. Neem contact met ons op via de contactpagina voor de mogelijkheden.
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form Column (60%) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display text-xl font-bold text-uvon-purple mb-6">Meld je aan als lid</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Volledige naam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Voor- en achternaam"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      E-mailadres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="naam@bedrijf.nl"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefoonnummer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0612345678"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bedrijfsnaam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Naam van jouw onderneming"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessSector" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Branche / Sector <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessSector"
                      name="businessSector"
                      required
                      value={formData.businessSector}
                      onChange={handleChange}
                      placeholder="Bijv. Zakelijke Dienstverlening"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.jouwwebsite.nl"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1.5">
                    LinkedIn Profiel URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://www.linkedin.com/in/jouwprofiel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Korte omschrijving van jezelf en je onderneming <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Vertel ons wat over je bedrijf en wat je motivatie is om lid te worden van UVON..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm resize-none"
                  />
                </div>

                {/* Status Alerts */}
                {status.type === "success" && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{status.message}</span>
                  </div>
                )}

                {status.type === "error" && (
                  <div className="p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                    <span>{status.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status.type === "loading" ? (
                    "Verwerken..."
                  ) : (
                    <>
                      Lidmaatschap aanvragen
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Calendar, User, Mail, Phone, Building2, Send, CheckCircle2, AlertCircle, CreditCard } from "lucide-react";

interface EventProps {
  event: {
    id: string;
    title: string;
    price: number;
    date: Date;
  };
}

export default function EventRegistrationForm({ event }: EventProps) {
  const [isMember, setIsMember] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Inschrijving wordt verwerkt..." });

    try {
      const payload = isMember
        ? { eventId: event.id, isMember: true, email: formData.email } // simplified for demo
        : { eventId: event.id, isMember: false, ...formData };

      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.paymentUrl) {
          // Redirect to Mollie checkout page!
          setStatus({ type: "loading", message: "Je wordt doorgestuurd naar de betaalpagina..." });
          window.location.href = data.paymentUrl;
        } else {
          setStatus({
            type: "success",
            message: "Gefeliciteerd! Je bent succesvol aangemeld voor deze bijeenkomst. Er is een bevestigingsmail onderweg.",
          });
          setFormData({ name: "", email: "", phone: "", companyName: "" });
        }
      } else {
        setStatus({
          type: "error",
          message: data.error || "Er is een fout opgetreden bij het aanmelden. Probeer het opnieuw.",
        });
      }
    } catch (error) {
      console.error("Failed to register for event:", error);
      setStatus({
        type: "error",
        message: "Kon geen verbinding maken met de server. Controleer uw verbinding.",
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-display text-xl font-bold text-uvon-purple mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-uvon-accent" />
        Inschrijven voor bijeenkomst
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        {event.price === 0 ? (
          "Deze bijeenkomst is gratis toegankelijk voor gasten en leden."
        ) : (
          <>
            Toegangsprijs voor gasten is{" "}
            <span className="font-bold text-uvon-purple">€ {event.price.toFixed(2)}</span> (inclusief BTW en diner). Leden kunnen na inloggen kosteloos of met korting registreren.
          </>
        )}
      </p>

      {/* Tab Selector */}
      <div className="flex border-b border-gray-100 mb-6">
        <button
          onClick={() => {
            setIsMember(false);
            setStatus({ type: "idle", message: "" });
          }}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
            !isMember
              ? "border-uvon-purple text-uvon-purple"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Aanmelden als Gast
        </button>
        <button
          onClick={() => {
            setIsMember(true);
            setStatus({ type: "idle", message: "" });
          }}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
            isMember
              ? "border-uvon-purple text-uvon-purple"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Aanmelden als Lid
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        {isMember ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Ben je al lid van UVON Noord-Brabant? Vul hieronder je e-mailadres in om je aan te melden. 
              <br/>
              <span className="text-xs text-gray-400 italic">Tip: log in via het menu om dit formulier automatisch in te vullen.</span>
            </p>
            <div>
              <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mailadres lidmaatschap <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="member-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="naam@voorbeeld.nl"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="guest-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Volledige naam <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="guest-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Voor- en achternaam"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="guest-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="naam@voorbeeld.nl"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guest-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Telefoonnummer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    id="guest-phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0612345678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guest-company" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bedrijfsnaam
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="guest-company"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Bedrijfsnaam (optioneel)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl shadow transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {status.type === "loading" ? (
            "Inschrijving verwerken..."
          ) : (
            <>
              {event.price > 0 && !isMember ? (
                <>
                  Inschrijven & Betalen via Mollie
                  <CreditCard className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Inschrijven bijeenkomst
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

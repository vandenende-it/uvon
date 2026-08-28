"use client";

import React, { useState } from "react";
import { Mail, Landmark, FileText, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
    setStatus({ type: "loading", message: "Bericht wordt verzonden..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Bedankt! Je bericht is succesvol verzonden. We nemen zo snel mogelijk contact met je op.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Er is iets misgegaan. Probeer het later opnieuw.",
        });
      }
    } catch (error) {
      console.error("Failed to send contact message:", error);
      setStatus({
        type: "error",
        message: "Kon geen verbinding maken met de server. Controleer uw internetverbinding.",
      });
    }
  };

  return (
    <div className="py-16 md:py-24 bg-gray-50 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider text-uvon-accent font-bold">Contact</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-uvon-purple mt-2 tracking-tight">
            Neem contact met ons op
          </h1>
          <div className="h-1.5 w-20 bg-uvon-accent rounded-full mx-auto mt-4" />
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Heb je vragen over ons netwerk, wil je een bijeenkomst bijwonen als gast, of wil je meer weten over de vereniging? Stuur ons gerust een bericht!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-display text-xl font-bold text-uvon-purple">Contactgegevens</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-uvon-light flex items-center justify-center text-uvon-purple shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">E-mail</span>
                    <a
                      href="mailto:info@uvonnoordbrabant.nl"
                      className="text-sm sm:text-base font-semibold text-uvon-purple hover:text-uvon-accent transition-colors"
                    >
                      info@uvonnoordbrabant.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-uvon-light flex items-center justify-center text-uvon-purple shrink-0 mt-0.5">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Bankgegevens</span>
                    <span className="text-sm sm:text-base font-semibold text-uvon-purple block">ING Bank</span>
                    <span className="text-xs text-gray-500">NL13 ING B 0688 706 673</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-uvon-light flex items-center justify-center text-uvon-purple shrink-0 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Kamer van Koophandel</span>
                    <span className="text-sm sm:text-base font-semibold text-uvon-purple block">Inschrijving KvK</span>
                    <span className="text-xs text-gray-500">KvK-nummer: 171 41 161</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative block */}
            <div className="relative h-60 rounded-3xl overflow-hidden shadow-sm hidden lg:block">
              {/* Image representing Noord-Brabant or professional women */}
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                alt="UVON Netwerk"
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-uvon-dark/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium leading-snug">
                  Het leukste en meest actieve netwerk voor Brabantse onderneemsters.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display text-xl font-bold text-uvon-purple mb-6">Stuur ons een bericht</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Naam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jouw naam"
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
                      placeholder="naam@voorbeeld.nl"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Onderwerp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Waar gaat je bericht over?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bericht <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Schrijf hier je vraag of opmerking..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm resize-none"
                  />
                </div>

                {/* Status Notifications */}
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
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-full shadow-sm hover:shadow transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status.type === "loading" ? (
                    "Verzenden..."
                  ) : (
                    <>
                      Bericht verzenden
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

"use client";

import React, { useState } from "react";
import { User, Building2, Globe, Linkedin, FileText, Key, CheckCircle2, AlertCircle } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  businessSector: string | null;
  description: string | null;
  photoUrl: string | null;
  website: string | null;
  linkedin: string | null;
}

interface ProfileEditFormProps {
  user: UserData;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    companyName: user.companyName || "",
    businessSector: user.businessSector || "",
    description: user.description || "",
    photoUrl: user.photoUrl || "",
    website: user.website || "",
    linkedin: user.linkedin || "",
    currentPassword: "",
    newPassword: "",
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
    setStatus({ type: "loading", message: "Profiel wordt bijgewerkt..." });

    try {
      const response = await fetch("/api/members/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Je profielgegevens zijn succesvol bijgewerkt! Wijzigingen zijn direct zichtbaar in de ledenlijst.",
        });
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      } else {
        setStatus({
          type: "error",
          message: data.error || "Er is een fout opgetreden bij het bijwerken.",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setStatus({
        type: "error",
        message: "Kon geen verbinding maken met de server.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Profile Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="font-display text-lg font-bold text-uvon-purple flex items-center mb-2">
          <User className="h-5 w-5 mr-2 text-uvon-accent" />
          Persoonlijke & Bedrijfsgegevens
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
              E-mailadres <span className="text-xs">(niet wijzigbaar)</span>
            </label>
            <input
              type="email"
              id="email"
              disabled
              value={user.email}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">
              Bedrijfsnaam
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Building2 className="h-4 w-4" />
              </span>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Je bedrijfsnaam"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="businessSector" className="block text-sm font-medium text-gray-700 mb-1.5">
              Branche / Sector
            </label>
            <input
              type="text"
              id="businessSector"
              name="businessSector"
              value={formData.businessSector}
              onChange={handleChange}
              placeholder="Bijv. Advocatuur, Coaching"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1.5">
              Website URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Globe className="h-4 w-4" />
              </span>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.jouwwebsite.nl"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1.5">
              LinkedIn URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Linkedin className="h-4 w-4" />
              </span>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/gebruiker"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Profielfoto URL <span className="text-xs text-gray-400">(link naar een online afbeelding)</span>
          </label>
          <input
            type="url"
            id="photoUrl"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/... of een andere link"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Bedrijfsomschrijving / Biografie op het ledenoverzicht
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3 text-gray-400">
              <FileText className="h-4 w-4" />
            </span>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Vertel de andere leden meer over jezelf, je bedrijf en wat je kunt betekenen voor het netwerk..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Password Change Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="font-display text-lg font-bold text-uvon-purple flex items-center mb-2">
          <Key className="h-5 w-5 mr-2 text-uvon-accent" />
          Wachtwoord wijzigen
        </h3>
        <p className="text-xs text-gray-500 leading-normal -mt-2">
          Laat deze velden leeg als je je huidige wachtwoord wilt behouden.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Huidig wachtwoord
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nieuw wachtwoord
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Minimaal 6 tekens"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
            />
          </div>
        </div>
      </div>

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
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl shadow transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
      >
        {status.type === "loading" ? "Bijwerken..." : "Wijzigingen opslaan"}
      </button>
    </form>
  );
}

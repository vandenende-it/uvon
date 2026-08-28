"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, Sparkles, LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to profile page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/leden/profiel");
    }
  }, [status, router]);

  // Check for NextAuth default errors in URL query params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "CredentialsSignin") {
      setError("Ongeldig e-mailadres of wachtwoord.");
    } else if (errorParam) {
      setError("Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/leden/profiel");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Er is een onverwachte fout opgetreden. Probeer het later opnieuw.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full relative overflow-hidden">
      {/* Decorative top gradient border */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-uvon-purple via-uvon-accent to-uvon-lavender" />

      <div className="text-center mb-8">
        <span className="font-display text-2xl font-bold tracking-tight text-uvon-purple">
          UVON <span className="text-uvon-accent">Ledenportaal</span>
        </span>
        <h2 className="text-sm text-gray-500 mt-2">Log in om uw profiel en verenigingsdocumenten te beheren</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            E-mailadres
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Wachtwoord
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uvon-purple/20 focus:border-uvon-purple transition-all text-sm"
            />
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl shadow transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            "Inloggen..."
          ) : (
            <>
              Inloggen
              <LogIn className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500 space-y-2">
        <p>
          Nog geen lid van ons netwerk?{" "}
          <Link href="/leden/lid-worden" className="font-semibold text-uvon-accent hover:underline">
            Meld je hier aan
          </Link>
        </p>
        <p>
          Wachtwoord vergeten? Neem contact op met het{" "}
          <a href="mailto:info@uvonnoordbrabant.nl" className="font-semibold hover:underline">
            secretariaat
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="py-16 md:py-24 bg-gray-50 flex-grow flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-uvon-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-uvon-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center">
          <Sparkles className="h-8 w-8 text-uvon-accent animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Laden...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

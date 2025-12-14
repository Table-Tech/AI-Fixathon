"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, Progress } from "@/components/ui";
import { Header } from "@/components/layout";

// Form step type
type FormData = {
  number_of_children: number;
  children_ages: number[];
  is_single_parent: boolean;
  income_range: "low" | "middle" | "high" | "";
  employment_status: "employed" | "unemployed" | "self_employed" | "student" | "";
  housing_type: "rent" | "own" | "";
  monthly_rent: number;
  postal_code: string;
  has_dutch_residence: boolean;
  has_health_insurance: boolean;
  has_debts: boolean;
  savings_under_limit: boolean;
};

const initialFormData: FormData = {
  number_of_children: 0,
  children_ages: [],
  is_single_parent: false,
  income_range: "",
  employment_status: "",
  housing_type: "",
  monthly_rent: 0,
  postal_code: "",
  has_dutch_residence: true,
  has_health_insurance: true,
  has_debts: false,
  savings_under_limit: true,
};

const TOTAL_STEPS = 5;

export default function CheckPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChildrenAgeChange = (index: number, age: number) => {
    const newAges = [...formData.children_ages];
    newAges[index] = age;
    setFormData((prev) => ({ ...prev, children_ages: newAges }));
  };

  const handleChildrenCountChange = (count: number) => {
    const newAges = Array(count).fill(0).map((_, i) => formData.children_ages[i] || 0);
    setFormData((prev) => ({
      ...prev,
      number_of_children: count,
      children_ages: newAges,
    }));
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Er ging iets mis");
      }

      // Store matches in sessionStorage (URL params have length limits)
      sessionStorage.setItem("check_matches", JSON.stringify(result.matches));

      // Navigate to results page
      router.push("/check/resultaten");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1">
        {/* Hero Header - Modern gradient design */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/70">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto px-4 py-8 md:py-12">
            {/* Back link */}
            <Link
              href="/regelingen"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Terug naar regelingen
            </Link>

            {/* Header content */}
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Klaar in 2 minuten
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Snelle Check
              </h1>
              <p className="text-white/90 text-lg max-w-md mx-auto">
                Ontdek in een paar stappen welke regelingen bij jouw situatie passen
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-white/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  100% Anoniem
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Gratis
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Direct resultaat
                </span>
              </div>
            </div>

            {/* Progress indicator - Modern style */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between text-sm text-white/90 mb-3">
                <span className="font-medium">Stap {step} van {TOTAL_STEPS}</span>
                <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
              {/* Step labels */}
              <div className="flex justify-between mt-3">
                {["Gezin", "Werk", "Wonen", "Extra", "Klaar"].map((label, i) => (
                  <span
                    key={label}
                    className={`text-xs transition-colors ${
                      i + 1 <= step ? "text-white" : "text-white/50"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto px-4 -mt-4 pb-8 md:pb-12">
          <Card className="shadow-xl border-0">
            <CardContent className="p-6 md:p-8">
              {/* Step 1: Children */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Gezinssituatie</h2>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      Vertel ons over je gezin
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Hoeveel kinderen heb je?
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleChildrenCountChange(num)}
                          className={`py-3 px-4 rounded-lg border-2 text-lg font-medium transition-all ${
                            formData.number_of_children === num
                              ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          {num === 4 ? "4+" : num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.number_of_children > 0 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-3">
                          Leeftijd van je kinderen
                        </label>
                        <div className="space-y-3">
                          {Array(formData.number_of_children).fill(0).map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30">
                              <span className="text-sm font-medium">
                                Kind {index + 1}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleChildrenAgeChange(index, Math.max(0, (formData.children_ages[index] || 0) - 1))}
                                  className="w-10 h-10 rounded-full border-2 border-[var(--border)] hover:border-[var(--primary)] flex items-center justify-center text-lg font-medium transition-colors"
                                  disabled={(formData.children_ages[index] || 0) <= 0}
                                >
                                  −
                                </button>
                                <div className="w-16 text-center">
                                  <span className="text-xl font-bold">{formData.children_ages[index] || 0}</span>
                                  <span className="text-xs text-[var(--muted-foreground)] block">jaar</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleChildrenAgeChange(index, Math.min(17, (formData.children_ages[index] || 0) + 1))}
                                  className="w-10 h-10 rounded-full border-2 border-[var(--border)] hover:border-[var(--primary)] flex items-center justify-center text-lg font-medium transition-colors"
                                  disabled={(formData.children_ages[index] || 0) >= 17}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">
                          Ben je alleenstaande ouder?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => updateFormData("is_single_parent", true)}
                            className={`py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                              formData.is_single_parent
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "border-[var(--border)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Ja, alleenstaand
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFormData("is_single_parent", false)}
                            className={`py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                              !formData.is_single_parent
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "border-[var(--border)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Nee, met partner
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 2: Income & Employment */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Inkomen & Werk</h2>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      Dit helpt ons de juiste regelingen te vinden
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Wat is je werksituatie?
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "employed", label: "In loondienst", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                        { value: "self_employed", label: "Zelfstandig ondernemer (ZZP)", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                        { value: "unemployed", label: "Geen werk / werkzoekend", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                        { value: "student", label: "Student", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateFormData("employment_status", option.value as FormData["employment_status"])}
                          className={`w-full py-4 px-4 rounded-lg border-2 font-medium transition-all flex items-center gap-3 ${
                            formData.employment_status === option.value
                              ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                          </svg>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Wat is je inkomensniveau? (bruto per jaar)
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "low", label: "Laag inkomen", desc: "Minder dan €30.000" },
                        { value: "middle", label: "Midden inkomen", desc: "€30.000 - €50.000" },
                        { value: "high", label: "Hoger inkomen", desc: "Meer dan €50.000" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateFormData("income_range", option.value as FormData["income_range"])}
                          className={`w-full py-4 px-4 rounded-lg border-2 font-medium transition-all text-left ${
                            formData.income_range === option.value
                              ? "border-[var(--primary)] bg-[var(--primary)]/10"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <span className={formData.income_range === option.value ? "text-[var(--primary)]" : ""}>
                            {option.label}
                          </span>
                          <span className="block text-sm text-[var(--muted-foreground)]">{option.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Housing */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Woonsituatie</h2>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      Belangrijk voor huur- en woongerelateerde regelingen
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Huur of koop je je woning?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateFormData("housing_type", "rent")}
                        className={`py-6 px-4 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${
                          formData.housing_type === "rent"
                            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "border-[var(--border)] hover:border-[var(--primary)]/50"
                        }`}
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Ik huur
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData("housing_type", "own")}
                        className={`py-6 px-4 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${
                          formData.housing_type === "own"
                            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "border-[var(--border)] hover:border-[var(--primary)]/50"
                        }`}
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Ik koop
                      </button>
                    </div>
                  </div>

                  {formData.housing_type === "rent" && (
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Hoeveel huur betaal je per maand?
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 400, label: "Minder dan €400" },
                          { value: 600, label: "€400 - €600" },
                          { value: 800, label: "€600 - €800" },
                          { value: 900, label: "€800 - €900" },
                          { value: 1000, label: "Meer dan €900" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateFormData("monthly_rent", option.value)}
                            className={`w-full py-3 px-4 rounded-lg border-2 font-medium transition-all text-left ${
                              formData.monthly_rent === option.value
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "border-[var(--border)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Wat is je postcode? (optioneel)
                    </label>
                    <input
                      type="text"
                      placeholder="bijv. 1234 AB"
                      value={formData.postal_code}
                      onChange={(e) => updateFormData("postal_code", e.target.value.toUpperCase())}
                      maxLength={7}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-lg"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Sommige regelingen verschillen per gemeente
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Info */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Aanvullende informatie</h2>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      Nog een paar vragen om de beste match te vinden
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "has_dutch_residence",
                        question: "Woon je in Nederland?",
                        description: "Je hebt een verblijfsvergunning of Nederlandse nationaliteit",
                      },
                      {
                        key: "has_health_insurance",
                        question: "Heb je een Nederlandse zorgverzekering?",
                        description: "Basiszorgverzekering bij een Nederlandse verzekeraar",
                      },
                      {
                        key: "has_debts",
                        question: "Heb je schulden of betalingsproblemen?",
                        description: "Er zijn regelingen die hierbij kunnen helpen",
                      },
                      {
                        key: "savings_under_limit",
                        question: "Is je spaargeld minder dan €7.000?",
                        description: "Voor sommige regelingen geldt een vermogensgrens",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">{item.question}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateFormData(item.key as keyof FormData, true)}
                              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                formData[item.key as keyof FormData] === true
                                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
                              }`}
                            >
                              Ja
                            </button>
                            <button
                              type="button"
                              onClick={() => updateFormData(item.key as keyof FormData, false)}
                              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                formData[item.key as keyof FormData] === false
                                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
                              }`}
                            >
                              Nee
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Controleer je gegevens</h2>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      Kloppen deze gegevens? Dan gaan we je regelingen berekenen!
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Summary cards */}
                    <div className="grid gap-3">
                      <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                        <p className="text-sm text-[var(--muted-foreground)]">Gezin</p>
                        <p className="font-medium">
                          {formData.number_of_children === 0
                            ? "Geen kinderen"
                            : `${formData.number_of_children} kind${formData.number_of_children > 1 ? "eren" : ""}`}
                          {formData.is_single_parent && formData.number_of_children > 0 && " • Alleenstaande ouder"}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                        <p className="text-sm text-[var(--muted-foreground)]">Werk & Inkomen</p>
                        <p className="font-medium">
                          {formData.employment_status === "employed" && "In loondienst"}
                          {formData.employment_status === "self_employed" && "Zelfstandig ondernemer"}
                          {formData.employment_status === "unemployed" && "Werkzoekend"}
                          {formData.employment_status === "student" && "Student"}
                          {!formData.employment_status && "Niet ingevuld"}
                          {" • "}
                          {formData.income_range === "low" && "Laag inkomen"}
                          {formData.income_range === "middle" && "Midden inkomen"}
                          {formData.income_range === "high" && "Hoger inkomen"}
                          {!formData.income_range && "Niet ingevuld"}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                        <p className="text-sm text-[var(--muted-foreground)]">Wonen</p>
                        <p className="font-medium">
                          {formData.housing_type === "rent" && `Huurwoning${formData.monthly_rent ? ` (€${formData.monthly_rent}/maand)` : ""}`}
                          {formData.housing_type === "own" && "Koopwoning"}
                          {!formData.housing_type && "Niet ingevuld"}
                          {formData.postal_code && ` • ${formData.postal_code}`}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-[var(--muted)]/50">
                        <p className="text-sm text-[var(--muted-foreground)]">Aanvullend</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.has_dutch_residence && (
                            <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Woont in NL
                            </span>
                          )}
                          {formData.has_health_insurance && (
                            <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Zorgverzekering
                            </span>
                          )}
                          {formData.has_debts && (
                            <span className="inline-flex items-center gap-1 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Schulden
                            </span>
                          )}
                          {formData.savings_under_limit && (
                            <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Spaargeld onder grens
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-[var(--border)]">
                {step > 1 ? (
                  <Button variant="outline" onClick={prevStep}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Vorige
                  </Button>
                ) : (
                  <div />
                )}

                {step < TOTAL_STEPS ? (
                  <Button onClick={nextStep}>
                    Volgende
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Berekenen...
                      </>
                    ) : (
                      <>
                        Bekijk mijn regelingen
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

"use client";

import { Button, Card, CardContent, Input, Select, Skeleton } from "@/components/ui";
import { useAuth } from "@/hooks";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IncomeRange, EmploymentStatus, HousingType } from "@/types/database";

const childrenOptions = [
  { value: "0", label: "Geen kinderen" },
  { value: "1", label: "1 kind" },
  { value: "2", label: "2 kinderen" },
  { value: "3", label: "3 kinderen" },
  { value: "4", label: "4 kinderen" },
  { value: "5", label: "5+ kinderen" },
];

const incomeOptions = [
  { value: "", label: "Selecteer..." },
  { value: "low", label: "Laag (minder dan €25.000/jaar)" },
  { value: "middle", label: "Midden (€25.000 - €50.000/jaar)" },
  { value: "high", label: "Hoog (meer dan €50.000/jaar)" },
];

const employmentOptions = [
  { value: "", label: "Selecteer..." },
  { value: "employed", label: "In loondienst" },
  { value: "self_employed", label: "Zelfstandige (ZZP)" },
  { value: "unemployed", label: "Werkloos" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Gepensioneerd" },
];

const housingOptions = [
  { value: "", label: "Selecteer..." },
  { value: "rent", label: "Huurwoning" },
  { value: "own", label: "Koopwoning" },
];

export default function GegevensPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    postal_code: "",
    city: "",
    number_of_children: 0,
    children_ages: [] as number[],
    is_single_parent: false,
    income_range: "" as IncomeRange | "",
    employment_status: "" as EmploymentStatus | "",
    housing_type: "" as HousingType | "",
    monthly_rent: 0,
    has_dutch_residence: true,
    has_health_insurance: true,
    has_debts: false,
    savings_under_limit: true,
  });

  // Track original data to detect changes
  const [originalData, setOriginalData] = useState<typeof formData | null>(null);

  const hasChanges = originalData !== null && JSON.stringify(formData) !== JSON.stringify(originalData);

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const loadedData = {
        name: data?.name || "",
        date_of_birth: data?.date_of_birth || "",
        postal_code: data?.postal_code || "",
        city: data?.city || "",
        number_of_children: data?.number_of_children || 0,
        children_ages: data?.children_ages || [],
        is_single_parent: data?.is_single_parent || false,
        income_range: data?.income_range || "",
        employment_status: data?.employment_status || "",
        housing_type: data?.housing_type || "",
        monthly_rent: data?.monthly_rent || 0,
        has_dutch_residence: data?.has_dutch_residence ?? true,
        has_health_insurance: data?.has_health_insurance ?? true,
        has_debts: data?.has_debts || false,
        savings_under_limit: data?.savings_under_limit ?? true,
      };
      setFormData(loadedData);
      setOriginalData(loadedData);

      setLoading(false);
    }

    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        loadProfile();
      }
    }
  }, [user, authLoading, router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name || null,
        date_of_birth: formData.date_of_birth || null,
        postal_code: formData.postal_code || null,
        city: formData.city || null,
        number_of_children: formData.number_of_children || null,
        children_ages: formData.children_ages.length > 0 ? formData.children_ages : null,
        is_single_parent: formData.is_single_parent,
        income_range: formData.income_range || null,
        employment_status: formData.employment_status || null,
        housing_type: formData.housing_type || null,
        monthly_rent: formData.monthly_rent || null,
        has_dutch_residence: formData.has_dutch_residence,
        has_health_insurance: formData.has_health_insurance,
        has_debts: formData.has_debts,
        savings_under_limit: formData.savings_under_limit,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setOriginalData(formData);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const updateChildrenAges = (index: number, age: number) => {
    const newAges = [...formData.children_ages];
    newAges[index] = age;
    setFormData({ ...formData, children_ages: newAges });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-6">
          <Link href="/profiel" className="absolute left-0 p-2 hover:bg-[var(--muted)] rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Mijn gegevens</h1>
        </div>

        <div className="space-y-6">
          {/* Persoonlijk */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Persoonlijk</h2>
              <div className="space-y-4">
                <Input
                  label="Naam"
                  placeholder="Je volledige naam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Geboortedatum"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postcode"
                    placeholder="1234 AB"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                  <Input
                    label="Woonplaats"
                    placeholder="Amsterdam"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gezinssituatie */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Gezinssituatie</h2>
              <div className="space-y-4">
                <Select
                  label="Aantal kinderen"
                  options={childrenOptions}
                  value={formData.number_of_children.toString()}
                  onChange={(e) => {
                    const num = parseInt(e.target.value);
                    const newAges = Array(num).fill(0).map((_, i) => formData.children_ages[i] || 0);
                    setFormData({ ...formData, number_of_children: num, children_ages: newAges });
                  }}
                />

                {formData.number_of_children > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Leeftijden kinderen</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Array(formData.number_of_children).fill(0).map((_, i) => (
                        <Input
                          key={i}
                          type="number"
                          placeholder={`Kind ${i + 1}`}
                          min="0"
                          max="30"
                          value={formData.children_ages[i] || ""}
                          onChange={(e) => updateChildrenAges(i, parseInt(e.target.value) || 0)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_single_parent}
                    onChange={(e) => setFormData({ ...formData, is_single_parent: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border)]"
                  />
                  <span>Ik ben alleenstaande ouder</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Financieel */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Financieel</h2>
              <div className="space-y-4">
                <Select
                  label="Inkomen"
                  options={incomeOptions}
                  value={formData.income_range}
                  onChange={(e) => setFormData({ ...formData, income_range: e.target.value as IncomeRange })}
                />

                <Select
                  label="Werkstatus"
                  options={employmentOptions}
                  value={formData.employment_status}
                  onChange={(e) => setFormData({ ...formData, employment_status: e.target.value as EmploymentStatus })}
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_debts}
                    onChange={(e) => setFormData({ ...formData, has_debts: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border)]"
                  />
                  <span>Ik heb problematische schulden</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.savings_under_limit}
                    onChange={(e) => setFormData({ ...formData, savings_under_limit: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border)]"
                  />
                  <span>Mijn spaargeld is onder de vermogensgrens</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Wonen */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Woonsituatie</h2>
              <div className="space-y-4">
                <Select
                  label="Woningtype"
                  options={housingOptions}
                  value={formData.housing_type}
                  onChange={(e) => setFormData({ ...formData, housing_type: e.target.value as HousingType })}
                />

                {formData.housing_type === "rent" && (
                  <Input
                    label="Maandelijkse huur"
                    type="number"
                    placeholder="750"
                    min="0"
                    value={formData.monthly_rent || ""}
                    onChange={(e) => setFormData({ ...formData, monthly_rent: parseInt(e.target.value) || 0 })}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Overig</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_dutch_residence}
                    onChange={(e) => setFormData({ ...formData, has_dutch_residence: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border)]"
                  />
                  <span>Ik heb een geldige verblijfsvergunning</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_health_insurance}
                    onChange={(e) => setFormData({ ...formData, has_health_insurance: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border)]"
                  />
                  <span>Ik heb een Nederlandse zorgverzekering</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Spacer for floating button */}
          {hasChanges && <div className="h-20" />}
        </div>
      </div>

      {/* Floating save button - only shows when there are changes */}
      {hasChanges && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 md:bottom-4">
          <div className="max-w-2xl mx-auto">
            {error && (
              <p className="text-sm text-red-500 text-center mb-2 bg-[var(--background)] rounded py-1">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 text-center mb-2 bg-[var(--background)] rounded py-1">Gegevens opgeslagen!</p>
            )}
            <Button
              className="w-full shadow-lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Opslaan..." : "Wijzigingen opslaan"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

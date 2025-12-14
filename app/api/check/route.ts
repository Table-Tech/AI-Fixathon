import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Types
interface CheckFormData {
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
}

interface RegelingDetails {
  description: string;
  short_description?: string;
  category: string;
  requirements: string[];
  documents_needed: string[];
  source_url: string;
  provider: string;
  how_to_apply: string;
  estimated_amount?: string;
  impact_score?: number;
}

interface Regeling {
  id: string;
  slug: string;
  title: string;
  eligible_for: string[];
  min_age: number | null;
  max_age: number | null;
  details: RegelingDetails;
  is_active: boolean;
}

interface MatchResult {
  id: string;
  slug: string;
  title: string;
  category: string;
  estimated_amount: string;
  short_description: string;
  provider: string;
  match_score: number;
  match_reasons: string[];
}

// Mapping from form data to eligible_for tags
function getUserTags(formData: CheckFormData): { tag: string; label: string }[] {
  const tags: { tag: string; label: string }[] = [];

  // Income-based tags
  if (formData.income_range === "low") {
    tags.push({ tag: "low_income", label: "Laag inkomen" });
    tags.push({ tag: "long_term_low_income", label: "Laag inkomen" });
  }

  // Family-based tags
  if (formData.number_of_children > 0) {
    tags.push({ tag: "parent", label: "Ouder met kinderen" });
  }

  if (formData.is_single_parent && formData.number_of_children > 0) {
    tags.push({ tag: "single_mom", label: "Alleenstaande ouder" });
    tags.push({ tag: "single_parent", label: "Alleenstaande ouder" });
  }

  // Employment-based tags
  if (formData.employment_status === "employed" && formData.number_of_children > 0) {
    tags.push({ tag: "working_parent", label: "Werkende ouder" });
  }

  if (formData.employment_status === "student" && formData.number_of_children > 0) {
    tags.push({ tag: "student_parent", label: "Studerende ouder" });
  }

  if (formData.employment_status === "unemployed") {
    tags.push({ tag: "unemployed", label: "Werkzoekend" });
    tags.push({ tag: "no_income", label: "Geen inkomen" });
  }

  // Housing-based tags
  if (formData.housing_type === "rent") {
    tags.push({ tag: "renter", label: "Huurwoning" });
  }

  if (formData.housing_type === "rent" && formData.monthly_rent > 700) {
    tags.push({ tag: "high_housing_costs", label: "Hoge woonlasten" });
  }

  // Financial situation tags
  if (formData.has_debts) {
    tags.push({ tag: "debt", label: "Schulden" });
    tags.push({ tag: "financial_hardship", label: "Financiele problemen" });
  }

  return tags;
}

// Calculate match score for a regeling
function calculateMatchScore(
  regeling: Regeling,
  userTags: { tag: string; label: string }[],
  formData: CheckFormData
): { score: number; reasons: string[] } {
  const eligibleFor = regeling.eligible_for || [];
  const matchedTags = userTags.filter((ut) => eligibleFor.includes(ut.tag));
  const reasons: string[] = matchedTags.map((t) => t.label);

  // Base score from matched tags
  let score = 0;

  if (eligibleFor.length > 0) {
    // Calculate what percentage of the regeling's requirements the user meets
    const matchPercentage = (matchedTags.length / eligibleFor.length) * 100;
    score = Math.min(matchPercentage, 100);
  }

  // Bonus points for meeting multiple criteria
  if (matchedTags.length >= 3) {
    score = Math.min(score + 15, 100);
  } else if (matchedTags.length >= 2) {
    score = Math.min(score + 10, 100);
  }

  // Additional checks based on specific regelingen requirements

  // Huurtoeslag specific checks
  if (regeling.slug === "huurtoeslag") {
    if (formData.housing_type === "rent" && formData.monthly_rent <= 880) {
      score = Math.min(score + 20, 100);
      if (!reasons.includes("Huur onder maximum")) {
        reasons.push("Huur onder maximum");
      }
    }
    if (formData.income_range === "low" && formData.has_dutch_residence) {
      score = Math.min(score + 10, 100);
    }
  }

  // Zorgtoeslag specific checks
  if (regeling.slug === "zorgtoeslag") {
    if (formData.has_health_insurance && formData.income_range === "low") {
      score = Math.min(score + 20, 100);
      if (!reasons.includes("Zorgverzekering")) {
        reasons.push("Zorgverzekering");
      }
    }
  }

  // Kinderbijslag specific checks
  if (regeling.slug === "kinderbijslag") {
    if (formData.number_of_children > 0) {
      score = Math.min(score + 30, 100);
      reasons.push(`${formData.number_of_children} kind${formData.number_of_children > 1 ? "eren" : ""}`);
    }
  }

  // Kindgebonden budget specific checks
  if (regeling.slug === "kindgebonden-budget") {
    if (formData.number_of_children > 0 && formData.income_range === "low") {
      score = Math.min(score + 25, 100);
    }
  }

  // Alleenstaande ouder kop specific checks
  if (regeling.slug === "alleenstaande-ouder-kop") {
    if (formData.is_single_parent && formData.number_of_children > 0) {
      score = Math.min(score + 30, 100);
    }
  }

  // Kinderopvangtoeslag specific checks
  if (regeling.slug === "kinderopvangtoeslag") {
    const hasYoungChildren = formData.children_ages.some((age) => age < 4);
    if (hasYoungChildren && (formData.employment_status === "employed" || formData.employment_status === "student")) {
      score = Math.min(score + 25, 100);
      reasons.push("Kind(eren) onder 4 jaar");
    }
  }

  // Bijstand specific checks
  if (regeling.slug === "bijstandsuitkering") {
    if (formData.employment_status === "unemployed" && formData.savings_under_limit) {
      score = Math.min(score + 20, 100);
      if (!reasons.includes("Onder vermogensgrens")) {
        reasons.push("Onder vermogensgrens");
      }
    }
  }

  // Schuldhulpverlening specific checks
  if (regeling.slug === "schuldhulpverlening") {
    if (formData.has_debts) {
      score = Math.min(score + 40, 100);
    }
  }

  // Dutch residence requirement for most regelingen
  if (formData.has_dutch_residence) {
    score = Math.min(score + 5, 100);
  } else {
    score = Math.max(score - 30, 0); // Significant penalty if not residing in NL
  }

  // Round to nearest integer
  score = Math.round(score);

  // Deduplicate reasons
  const uniqueReasons = [...new Set(reasons)];

  return { score, reasons: uniqueReasons };
}

export async function POST(request: Request) {
  try {
    const formData: CheckFormData = await request.json();
    const supabase = createServerClient();

    // Fetch all active regelingen
    const { data: regelingen, error: regelingenError } = await supabase
      .from("regelingen")
      .select("*")
      .eq("is_active", true);

    if (regelingenError) {
      console.error("Error fetching regelingen:", regelingenError);
      return NextResponse.json(
        { error: "Failed to fetch regelingen" },
        { status: 500 }
      );
    }

    // Get user tags based on form data
    const userTags = getUserTags(formData);

    // Calculate match scores for each regeling
    const matches: MatchResult[] = (regelingen as Regeling[])
      .map((regeling) => {
        const { score, reasons } = calculateMatchScore(regeling, userTags, formData);
        return {
          id: regeling.id,
          slug: regeling.slug,
          title: regeling.title,
          category: regeling.details.category,
          estimated_amount: regeling.details.estimated_amount || "",
          short_description: regeling.details.short_description || regeling.details.description.slice(0, 120) + "...",
          provider: regeling.details.provider,
          match_score: score,
          match_reasons: reasons,
        };
      })
      .filter((match) => match.match_score >= 30) // Only include matches above 30%
      .sort((a, b) => b.match_score - a.match_score); // Sort by score descending

    // Try to save to profile if user is authenticated
    try {
      // Check for auth cookie
      const cookieStore = await cookies();
      const authCookie = cookieStore.get("sb-access-token");

      if (authCookie) {
        // Get user from auth
        const { data: { user } } = await supabase.auth.getUser(authCookie.value);

        if (user) {
          // Update profile with check data
          const profileUpdate = {
            number_of_children: formData.number_of_children,
            children_ages: formData.children_ages,
            is_single_parent: formData.is_single_parent,
            income_range: formData.income_range || null,
            employment_status: formData.employment_status || null,
            housing_type: formData.housing_type || null,
            monthly_rent: formData.monthly_rent || null,
            postal_code: formData.postal_code || null,
            has_dutch_residence: formData.has_dutch_residence,
            has_health_insurance: formData.has_health_insurance,
            has_debts: formData.has_debts,
            savings_under_limit: formData.savings_under_limit,
            updated_at: new Date().toISOString(),
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("profiles")
            .update(profileUpdate)
            .eq("id", user.id);
        }
      }
    } catch (authError) {
      // Silently fail - user is not authenticated, which is fine
      console.log("User not authenticated, skipping profile save");
    }

    return NextResponse.json({
      matches,
      total_found: matches.length,
      user_tags: userTags.map((t) => t.tag),
    });
  } catch (err) {
    console.error("Check API error:", err);
    return NextResponse.json(
      { error: "Er ging iets mis bij het berekenen van je regelingen" },
      { status: 500 }
    );
  }
}

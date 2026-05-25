import { getUserToken } from "@/utils/auth/token";
import { supabase } from "@/lib/supabase/supabase";
import type { ClientSummary } from "@/lib/query-options";

export type GeneratedMeal = {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  prep_time_min?: number;
  instructions?: string;
};

export type GeneratedDay = {
  day: string;
  meals: Record<"ontbijt" | "lunch" | "avondeten" | "snack", GeneratedMeal>;
};

export type GeneratedPlan = { days: GeneratedDay[] };

const MEAL_TYPES = ["ontbijt", "lunch", "avondeten", "snack"] as const;

export const generateMealPlan = async (
  client: ClientSummary,
  extraWishes?: string,
): Promise<GeneratedPlan> => {
  const token = await getUserToken();
  const preferences = [client.preferences, extraWishes].filter(Boolean).join(". ") || null;

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generate-menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      client: {
        full_name: client.full_name,
        goal: client.goal,
        calories_goal: client.calories_goal ?? 2000,
        protein_goal: client.protein_goal ?? 150,
        carbs_goal: client.carbs_goal ?? 200,
        fat_goal: client.fat_goal ?? 65,
        allergies: client.allergies ?? [],
        preferences,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Failed to generate meal plan: ${res.status}`);
  }

  const data = await res.json();
  return data.menu as GeneratedPlan;
};

async function getOrCreateRecipe(meal: GeneratedMeal, mealType: string, coachId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from("recipes")
    .select("id")
    .eq("coach_id", coachId)
    .ilike("name", meal.name.trim())
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("recipes")
    .insert({
      coach_id: coachId,
      name: meal.name,
      meal_type: mealType,
      calories: meal.calories,
      protein_g: meal.protein_g,
      carbs_g: meal.carbs_g,
      fat_g: meal.fat_g,
      instructions: meal.instructions,
      prep_time_min: meal.prep_time_min,
      servings: 1,
    })
    .select()
    .single();

  return error || !created ? null : created.id;
}

async function saveMealsForDay(day: GeneratedDay, dayId: string, coachId: string) {
  for (const mealType of MEAL_TYPES) {
    const meal = day.meals[mealType];

    const { data: createdMeal, error } = await supabase
      .from("meals")
      .insert({ meal_plan_day_id: dayId, meal_type: mealType })
      .select()
      .single();

    if (error || !createdMeal) continue;

    const recipeId = await getOrCreateRecipe(meal, mealType, coachId);
    if (!recipeId) continue;

    await supabase
      .from("meal_recipes")
      .insert({ meal_id: createdMeal.id, recipe_id: recipeId, servings: 1 });
  }
}

export const saveMealPlanFromAI = async ({
  name,
  clientId,
  generatedPlan,
}: {
  name: string;
  clientId: string;
  generatedPlan: GeneratedPlan;
}): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: plan, error: planError } = await supabase
    .from("meal_plans")
    .insert({ coach_id: user.id, name, client_id: clientId, is_active: true })
    .select()
    .single();

  if (planError || !plan) throw new Error("Failed to create meal plan");

  const { data: createdDays, error: daysError } = await supabase
    .from("meal_plan_days")
    .insert(generatedPlan.days.map((_, i) => ({ meal_plan_id: plan.id, day_number: i + 1 })))
    .select();

  if (daysError || !createdDays) throw new Error("Failed to create days");

  for (let i = 0; i < generatedPlan.days.length; i++) {
    await saveMealsForDay(generatedPlan.days[i], createdDays[i].id, user.id);
  }

  return plan.id;
};

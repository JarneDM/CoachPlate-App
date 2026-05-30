import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import type { Day, Plan, MealPlanSummary } from "@/types/meal-plan";

async function getMealPlans(): Promise<MealPlanSummary[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("meal_plans")
    .select("id, name, start_date, end_date, is_active, clients(full_name)")
    .eq("coach_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((plan) => ({
    ...plan,
    clients: Array.isArray(plan.clients) ? (plan.clients[0] ?? null) : plan.clients,
  })) as MealPlanSummary[];
}

export const mealPlansOptions = queryOptions({
  queryKey: ["meal-plans"],
  queryFn: getMealPlans,
});

async function getMealPlan(id: string): Promise<{ plan: Plan; days: Day[] } | null> {
  const { data: raw } = await supabase
    .from("meal_plans")
    .select(
      `id, name, start_date, end_date,
      clients (id, full_name, calories_goal, protein_goal, carbs_goal, fat_goal),
      meal_plan_days (
        id, day_number, date,
        meals (
          id, meal_type,
          meal_recipes (
            id, servings,
            recipes (id, name, meal_type, calories, protein_g, carbs_g, fat_g, coach_id)
          )
        )
      )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!raw) return null;

  const days = [...(raw.meal_plan_days ?? [])].sort((a: Day, b: Day) => a.day_number - b.day_number);
  return { plan: raw as any, days };
}

export const mealPlanOptions = (id: string) =>
  queryOptions({
    queryKey: ["meal-plan", id],
    queryFn: () => getMealPlan(id),
    enabled: !!id,
  });

export async function addRecipeToMeal({
  dayId,
  mealType,
  recipeId,
  servings,
}: {
  dayId: string;
  mealType: string;
  recipeId: string;
  servings: number;
}) {
  const { data: existingMeal } = await supabase
    .from("meals")
    .select("id")
    .eq("meal_plan_day_id", dayId)
    .eq("meal_type", mealType)
    .maybeSingle();

  let mealId: string;

  if (existingMeal) {
    mealId = existingMeal.id;
  } else {
    const { data: newMeal, error } = await supabase
      .from("meals")
      .insert({ meal_plan_day_id: dayId, meal_type: mealType })
      .select("id")
      .single();

    if (error || !newMeal) throw new Error("Failed to create meal");
    mealId = newMeal.id;
  }

  await supabase.from("meal_recipes").insert({ meal_id: mealId, recipe_id: recipeId, servings });
}

export async function removeRecipeFromMeal(mealRecipeId: string) {
  await supabase.from("meal_recipes").delete().eq("id", mealRecipeId);
}

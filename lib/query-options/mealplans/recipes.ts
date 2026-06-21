import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import type { Recipe } from "@/types/meal-plan";

async function getRecipes(): Promise<{ recipes: Recipe[]; userId: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { recipes: [], userId: null };

  const [coachResult, publicResult] = await Promise.all([
    supabase.from("recipes").select("*").eq("coach_id", user.id),
    supabase.from("recipes").select("*").eq("is_public", true),
  ])

  const all = [...(coachResult.data ?? []), ...(publicResult.data ?? [])];
  const unique = Array.from(new Map(all.map((r) => [r.id, r])).values());
  return { recipes: unique as Recipe[], userId: user.id };
}

export const recipesOptions = queryOptions({
  queryKey: ["recipes"],
  queryFn: getRecipes,
  staleTime: 5 * 60 * 1000,
});

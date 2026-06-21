import { supabase } from "@/lib/supabase/supabase"
import { queryOptions } from "@tanstack/react-query"

export const getRecipes = async ({ coachId }: { coachId: string }) => {
  try {
    const { data: recipes, error } = await supabase.from("recipes").select("*").eq("coach_id", coachId)
    return recipes
  } catch (error) {
    console.error("Error fetching recipes:", error)
    throw error
  }
}

export const getPublicRecipes = async () => {
  try {
    const { data: publicRecipes, error } = await supabase.from("recipes").select("*").eq("public", true)
    return publicRecipes
  } catch (error) {
    console.error("Error fetching public recipes:", error)
    throw error
  }
}

export const coachRecipeOptions = ({ coachId }: { coachId: string }) => {
  return queryOptions({
    queryKey: ["recipes", coachId],
    queryFn: () => getRecipes({ coachId }),
    staleTime: 5 * 60 * 1000,
  })
}

export const publicRecipeOptions = () => {
  return queryOptions({
    queryKey: ["public-recipes"],
    queryFn: getPublicRecipes,
    staleTime: 5 * 60 * 1000,
  })
}

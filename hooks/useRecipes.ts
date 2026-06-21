import { useQuery } from "@tanstack/react-query";
import { recipesOptions } from "@/lib/query-options";
import { coachRecipeOptions, publicRecipeOptions } from "@/lib/query-options/recipes/recipes"

export function useRecipes() {
  const { data } = useQuery(recipesOptions);

  return {
    recipes: data?.recipes ?? [],
    userId: data?.userId ?? null,
  };
}

export const useCoachRecipes = ({ coachId }: { coachId: string }) => {
  const { data, isFetching } = useQuery(coachRecipeOptions({ coachId }))

  return {
    coachRecipes: data ?? [],
    isLoading: isFetching,
  }
}

export const usePublicRecipes = () => {
  const { data, isFetching } = useQuery(publicRecipeOptions())

  return {
    publicRecipes: data ?? [],
    isLoading: isFetching,
  }
}

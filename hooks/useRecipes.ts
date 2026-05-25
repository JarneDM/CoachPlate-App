import { useQuery } from "@tanstack/react-query";
import { recipesOptions } from "@/lib/query-options";

export function useRecipes() {
  const { data } = useQuery(recipesOptions);

  return {
    recipes: data?.recipes ?? [],
    userId: data?.userId ?? null,
  };
}

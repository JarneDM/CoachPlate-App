import { useQuery } from "@tanstack/react-query";
import { mealPlanOptions } from "@/lib/query-options";

export function useMealPlan(id: string) {
  const { data, isLoading } = useQuery(mealPlanOptions(id));

  return {
    plan: data?.plan ?? null,
    days: data?.days ?? [],
    loading: isLoading,
  };
}

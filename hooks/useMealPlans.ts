import { useQuery } from "@tanstack/react-query";
import { mealPlansOptions } from "@/lib/query-options";

export function useMealPlans() {
  const { data = [], isLoading, isFetching, refetch } = useQuery(mealPlansOptions);

  return {
    plans: data,
    loading: isLoading,
    refreshing: isFetching && !isLoading,
    onRefresh: () => { refetch(); },
  };
}

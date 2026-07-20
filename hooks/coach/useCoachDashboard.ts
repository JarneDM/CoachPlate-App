import { useQuery } from "@tanstack/react-query"
import { coachDashboardOptions } from "@/lib/query-options/coach"

export const useCoachDashboard = () => {
  const { data, isLoading } = useQuery(coachDashboardOptions)

  return {
    coach: data?.coach ?? null,
    clientCount: data?.clientCount ?? 0,
    mealPlanCount: data?.mealPlanCount ?? 0,
    recentClients: data?.recentClients ?? [],
    loading: isLoading,
  }
}

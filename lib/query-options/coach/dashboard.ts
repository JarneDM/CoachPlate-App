import { queryOptions } from "@tanstack/react-query"
import { getClients, getRecentClients } from "@/lib/api/coach/getClients"
import type { Coach } from "@/types/coach"
import type { ClientSummary } from "@/types/client"
import { getCoach } from "@/lib/api/coach/getCoach"
import { getWeekPlansDashboard } from "@/lib/api/coach/getWeekPlans"

export type CoachDashboardData = {
  coach: Coach | undefined
  clientCount: number
  mealPlanCount: number
  recentClients: ClientSummary[]
}

async function getCoachDashboard(): Promise<CoachDashboardData> {
  const [coachResult, clients, mealPlanCountResult, recentClientsResult] = await Promise.all([
    getCoach(),
    getClients(),
    getWeekPlansDashboard(),
    getRecentClients()
  ])

  return {
    coach: coachResult,
    clientCount: clients.length,
    mealPlanCount: mealPlanCountResult.count ?? 0,
    recentClients: recentClientsResult ?? [],
  }
}

export const coachDashboardOptions = queryOptions({
  queryKey: ["coach", "dashboard"],
  queryFn: getCoachDashboard,
})

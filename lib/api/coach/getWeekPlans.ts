import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { WeekPlanDashboard } from "@/types/meal-plan";

export const getWeekPlansDashboard = async () => {
  try {
    const res = await fetchWithAuth<WeekPlanDashboard>("/coachplate/v1/coach/week-plans", {
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch week plans:", error);
    throw error;
  }
}
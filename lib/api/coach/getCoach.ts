import { fetchWithAuth } from "../fetchWithAuth";
import type { Coach } from "@/types/coach";
export const getCoach = async () => {
  try {
    const res = await fetchWithAuth<Coach>("/coachplate/v1/coach", {
      method: "GET",
    });
    if (!res){
      throw new Error(`Failed to fetch coach: ${res}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to fetch coach:", error)
  }
}
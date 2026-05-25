
import { getUserToken } from "@/utils/auth/token";

const generateMealPlan = async (clientId: string) => {
  try {
    const token = await getUserToken();
    const res = await fetch(`${process.env.EXPORT_PUBLIC_API_BASE_URL}/generate-menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ clientId }),
    });
    if (!res.ok) {
      throw new Error(`Failed to generate meal plan: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
}

export { generateMealPlan };
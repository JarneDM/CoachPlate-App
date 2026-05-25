
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
  } catch (error) {
    console.error("Error generating meal plan:", error);
  }
}

export { generateMealPlan };
import { getUserToken } from "utils/auth/token";
const generateTrainingPlan = async (client: object, extraWishes: string) => {
  try {
    const token = await getUserToken();
    
    const res = await fetch(`${process.env.EXPORT_PUBLIC_API_BASE_URL}/generate-training-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ client, extraWishes }),
    });
    if (!res.ok) {
      throw new Error(`Failed to generate training plan: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error generating training plan: ${error.message}`);
    }
  }
};

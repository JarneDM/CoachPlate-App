import { storeAuthSession } from "@/lib/auth/session"
import { AuthResponse } from "@/types/auth";

export const registerUser = async ({email, password, name, role, coachCode}: {email: string, password: string, name: string, role: string, coachCode?: string}): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/v1/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, role, coachCode }),
    })
    if (!res.ok) {
          throw new Error(`Failed to register: ${res.statusText}`);
        }
        const data: AuthResponse = await res.json();
        await storeAuthSession(data);
        return data;
  } catch (error){
    console.error("Error registering user:", error)
    throw new Error("Failed to register user")
  }
}
import { storeAuthSession } from "@/lib/auth/session"
import type { AuthResponse } from "@/types/auth"

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      throw new Error(`Failed to login: ${res.statusText}`)
    }
    const data: AuthResponse = await res.json()
    await storeAuthSession(data)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
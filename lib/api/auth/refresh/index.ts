import type { RefreshResponse } from "@/types/auth";

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshResponse> => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/v1/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      throw new Error(`Failed to refresh token: ${res.statusText}`);
    }
    const data: RefreshResponse = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

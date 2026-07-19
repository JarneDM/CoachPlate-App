import { getValidAccessToken } from "@/lib/auth/session";

export async function fetchWithAuth<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }

  return body as T;
}

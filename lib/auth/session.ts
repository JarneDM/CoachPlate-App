import { refreshAccessToken } from "@/lib/api/auth/refresh";
import { clearSession, getSession, setSession } from "@/lib/auth/tokenStorage";
import type { AuthSession, LoginResponse } from "@/types/auth";

const REFRESH_BUFFER_MS = 60 * 1000;

export async function storeAuthSession(response: LoginResponse): Promise<AuthSession> {
  const session: AuthSession = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt: Date.now() + response.expiresIn * 1000,
    user: response.user,
  };
  await setSession(session);
  return session;
}

export async function getValidAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  if (Date.now() < session.expiresAt - REFRESH_BUFFER_MS) {
    return session.accessToken;
  }

  const refreshed = await refreshAccessToken(session.refreshToken);
  const newSession: AuthSession = {
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    expiresAt: Date.now() + refreshed.expiresIn * 1000,
    user: session.user,
  };
  await setSession(newSession);
  return newSession.accessToken;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function getAuthenticatedUser() {
  try {
    const token = await getValidAccessToken();
    if (!token) return null;
    return await getCurrentUser();
  } catch (error) {
    console.error("Failed to restore session:", error);
    await clearSession();
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  await clearSession();
}

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AuthSession } from "@/types/auth";

const SESSION_KEY = "coachplate-auth-session";

const storage =
  Platform.OS === "web"
    ? {
        getItemAsync: (key: string) => {
          if (typeof window === "undefined") return Promise.resolve(null);
          return Promise.resolve(localStorage.getItem(key));
        },
        setItemAsync: (key: string, value: string) => {
          if (typeof window !== "undefined") localStorage.setItem(key, value);
          return Promise.resolve();
        },
        deleteItemAsync: (key: string) => {
          if (typeof window !== "undefined") localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : SecureStore;

export async function getSession(): Promise<AuthSession | null> {
  const raw = await storage.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as AuthSession;
}

export async function setSession(session: AuthSession): Promise<void> {
  await storage.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await storage.deleteItemAsync(SESSION_KEY);
}

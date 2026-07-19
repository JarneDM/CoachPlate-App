import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { getValidAccessToken } from "@/lib/auth/session";

export function useAuthTokenRefresh() {
  const refreshing = useRef(false);

  useEffect(() => {
    const refresh = () => {
      if (refreshing.current) return;
      refreshing.current = true;
      getValidAccessToken()
        .catch((error) => console.error("Background token refresh failed:", error))
        .finally(() => {
          refreshing.current = false;
        });
    };

    refresh();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });

    return () => subscription.remove();
  }, []);
}

import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthTokenRefresh } from "@/hooks/auth/useAuthTokenRefresh";

// TODO(STYLING): FOR EVERY BIG COMPONENT, CREATE A SEPARATE STYLESHEET IN THE COMPONENT FOLDER. DO NOT PUT STYLES IN THE SAME FILE AS THE COMPONENT, UNLESS IT'S A VERY SMALL COMPONENT (E.G. A BUTTON).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useAuthTokenRefresh();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}

import { loginUser } from "@/lib/api/auth/login"

export const loginMutationOptions = {
  mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
}

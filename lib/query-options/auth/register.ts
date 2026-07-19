import { registerUser } from "@/lib/api/auth/register"

export const registerMutationOptions = {
  mutationFn: ({ email, password, name, role, coachCode }: { email: string; password: string; name: string; role: string; coachCode?: string }) => registerUser({ email, password, name, role, coachCode }),
}
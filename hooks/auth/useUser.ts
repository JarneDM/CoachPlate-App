import { useQuery } from "@tanstack/react-query"
import { getUserOptions } from "@/lib/query-options/auth/user"

export const useUser = () => {
  const { data: user, isLoading, error } = useQuery(getUserOptions())

  return {
    user,
    isLoading,
    error,
  }
}
import { supabase } from "@/lib/supabase/supabase"
import { queryOptions } from "@tanstack/react-query"

export const getUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const getUserOptions = () => {
  return queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
  })
}
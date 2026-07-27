import { mutationOptions, queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { getAppointments } from "@/lib/api/coach/appointments"

export const getAppointmentsQueryOptions = queryOptions({
  queryKey: ["appointments"],
  queryFn: getAppointments,
})

export const useGetAppointmentsQueryOptions = () => {
  return useQuery(getAppointmentsQueryOptions)
}

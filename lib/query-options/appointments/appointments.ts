import { mutationOptions, queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { getAppointmentById, getAppointments } from "@/lib/api/coach/appointments"

export const getAppointmentsQueryOptions = queryOptions({
  queryKey: ["appointments"],
  queryFn: getAppointments,
})

export const useGetAppointmentsQueryOptions = () => {
  return useQuery(getAppointmentsQueryOptions)
}

export const getAppointmentByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["appointment", id],
    queryFn: () => getAppointmentById(id),
  })
}

export const useGetAppointmentByIdQueryOptions = (id: string) => {
  return useQuery(getAppointmentByIdQueryOptions(id))
}

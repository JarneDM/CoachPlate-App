import { mutationOptions, queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { addAppointment, editAppointment, getAppointmentById, getAppointments } from "@/lib/api/coach/appointments"
import { Appointment, NewAppointment } from "@/types/appointment"

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

export const addAppointmentMutationOptions = (data: NewAppointment) => {
  return mutationOptions({
    mutationKey: ["add-appointment"],
    mutationFn: () => addAppointment(data),
  })
}

export const useAddAppointmentMutationOptions = (data: NewAppointment) => {
  return useMutation(addAppointmentMutationOptions(data))
}

export const editAppointmentMutationOptions = (id: string, data: Partial<Appointment>) => {
  return mutationOptions({
    mutationKey: ["edit-appointment", id],
    mutationFn: () => editAppointment(id, data),
  })
}

export const useEditAppointmentMutationOptions = (id: string, data: Partial<Appointment>) => {
  return useMutation(editAppointmentMutationOptions(id, data))
}

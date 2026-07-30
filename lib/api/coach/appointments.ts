import { fetchWithAuth } from "../fetchWithAuth"
import type { Appointment } from "@/types/appointment"

export const getAppointments = async () => {
  try {
    const res = await fetchWithAuth<{ appointments: Appointment[] }>("/coachplate/v1/coach/appointments", {
      method: "GET",
    })
    return res.appointments
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getAppointmentById = async (id: string) => {
  try {
    const res = await fetchWithAuth<{ appointment: Appointment }>(`/coachplate/v1/coach/appointment/${id}`, {
      method: "GET",
    })
    return res.appointment
  } catch (error) {
    console.error(error)
    return null
  }
}

export const editAppointment = async (id: string, data: Partial<Appointment>) => {
  try {
    const res = await fetchWithAuth<{ appointment: Appointment }>(`/coachplate/v1/coach/appointment/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return res.appointment
  } catch (error) {
    console.error(error)
    return null
  }
}
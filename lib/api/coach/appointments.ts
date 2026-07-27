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
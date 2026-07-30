import { fetchWithAuth } from "../fetchWithAuth"
import type { Appointment } from "@/types/appointment"
import type { NewAppointment } from "@/types/appointment"

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

export const addAppointment = async (data: NewAppointment) => {
  const payload = {
    ...data,
    notes: data.notes.trim() || null,
    meeting_url: data.meeting_url.trim() || null,
  }
  const res = await fetchWithAuth<{ id: string }>("/coachplate/v1/coach/appointments/add", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return res.id
}

export const editAppointment = async (id: string, data: Partial<Appointment>) => {
  try {
    const app = { id, ...data }
    const res = await fetchWithAuth<{ appointment: Appointment }>(`/coachplate/v1/coach/appointments/edit`, {
      method: "PUT",
      body: JSON.stringify(app),
    })
    return res.appointment
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteAppointment = async (id: string) => {
  await fetchWithAuth<number>(`/coachplate/v1/coach/appointments/${id}`, {
    method: "DELETE",
  })
}
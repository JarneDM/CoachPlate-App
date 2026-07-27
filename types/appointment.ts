import type { ClientResponse } from "./clientResponse"
export type Appointment = {
  id: string
  client: ClientResponse
  coach_id: string
  date: string
  start_time: string
  end_time: string
  type: string
  status: "open" | "scheduled" | "completed" | "canceled" | "no_show"
  notes: string | null
  meeting_url: string
  created_at: string
  updated_at: string
}
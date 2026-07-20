import { fetchWithAuth } from "../fetchWithAuth"
import type { Client, Clients } from "@/types/client"

export const getClients = async () => {
  try {
    const res = await fetchWithAuth<{ clients: Client[] }>("/coachplate/v1/coach/clients", {
      method: "GET",
    })
    return res.clients
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    throw error
  }
}

export const getRecentClients = async () => {
  try {
    const res = await fetchWithAuth<Clients>("/coachplate/v1/coach/clients/recent", {
      method: "GET",
    })
    return res.clients
  } catch (error) {
    console.error("Failed to fetch recent clients:", error)
    throw error
  }
}
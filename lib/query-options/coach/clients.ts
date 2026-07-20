import { getClients } from "@/lib/api/coach/getClients"
import { queryOptions } from "@tanstack/react-query"

export const getClientsQueryOptions = queryOptions({
  queryKey: ["clients"],
  queryFn: getClients,
})

export const useGetClientsQueryOptions = () => {
  return getClientsQueryOptions
}
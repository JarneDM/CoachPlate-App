import { deleteClientById, getClients } from "@/lib/api/coach/getClients"
import { addClient } from "@/lib/api/coach/addClient"
import { mutationOptions, queryOptions, useMutation } from "@tanstack/react-query"
import { ClientForm } from "@/app/(coach)/clients/add"
import { getClientById } from "@/lib/api/coach/getClients"

export const getClientsQueryOptions = queryOptions({
  queryKey: ["clients"],
  queryFn: getClients,
})

export const useGetClientsQueryOptions = () => {
  return getClientsQueryOptions
}

export const addClientMutationOptions = mutationOptions({
  mutationKey: ["addClient"],
  mutationFn: (data: ClientForm) => addClient(data),
})

export const getClientByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
  })
}

export const useGetClientByIdQueryOptions = (id: string) => {
  return getClientByIdQueryOptions(id)
}

export const deleteClientMutationOptions = mutationOptions({
  mutationKey: ["deleteClient"],
  mutationFn: (id: string) => deleteClientById(id),
})

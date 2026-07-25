import { useQuery } from "@tanstack/react-query";
import { getClientByIdQueryOptions } from "@/lib/query-options"

export const useClientById = (id: string) => {
  const { data, isLoading } = useQuery(getClientByIdQueryOptions(id))

  return {
    client: data,
    loading: isLoading,
  };
}
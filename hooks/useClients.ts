import { useQuery } from "@tanstack/react-query";
import { clientsOptions } from "@/lib/query-options";

export const useClients = () => {
  const { data, isLoading } = useQuery(clientsOptions);

  return {
    clients: data ?? [],
    loading: isLoading,
  };
}
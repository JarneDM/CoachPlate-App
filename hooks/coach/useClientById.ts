import { useQuery } from "@tanstack/react-query";
import { clientByIdOptions } from "@/lib/query-options";

export const useClientById = (id: string) => {
  const { data, isLoading } = useQuery(clientByIdOptions(id));

  return {
    client: data,
    loading: isLoading,
  };
}
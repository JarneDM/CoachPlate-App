import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import type { Client } from "@/types/client";

async function getClients(): Promise<Client[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("clients").select("*").eq("coach_id", user.id).order("created_at", { ascending: false });

  return (data ?? []) as Client[];
}

export const clientsOptions = queryOptions({
  queryKey: ["clients"],
  queryFn: getClients,
});

async function getClientById(id: string): Promise<Client | null> {
  const { data } = await supabase.from("clients").select("*").eq("id", id).single();

  return (data as Client) ?? null;
}

export const clientByIdOptions = (id: string) => {
  return queryOptions({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
  });
};

export async function updateClient(id: string, fields: Partial<Omit<Client, "id">>) {
  const { error } = await supabase.from("clients").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
}

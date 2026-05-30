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

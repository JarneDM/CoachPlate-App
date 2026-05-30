import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import type { ClientSummary } from "@/types/client";

async function getClients(): Promise<ClientSummary[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("clients").select("*").eq("coach_id", user.id).order("created_at", { ascending: false });

  return (data ?? []) as ClientSummary[];
}

export const clientsOptions = queryOptions({
  queryKey: ["clients"],
  queryFn: getClients,
});

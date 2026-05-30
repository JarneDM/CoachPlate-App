import { supabase } from "@/lib/supabase/supabase";

export const getClients = async () => {
  const { data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: clients } = await supabase.from("clients").select("*").eq("coach_id", user.id);
  if (!clients) return [];
  return clients;
}
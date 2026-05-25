import { supabase } from "@/lib/supabase/supabase";

export async function getCoach() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientData } = await supabase.from("clients").select("coach_id").eq("user_id", user?.id).maybeSingle();
  const coach_id = clientData?.coach_id;

  if (!coach_id) return null;

  const { data: coach } = await supabase.from("coaches").select("*").eq("id", coach_id).maybeSingle();

  return coach;
}

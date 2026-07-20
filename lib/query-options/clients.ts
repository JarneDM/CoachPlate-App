import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import type { Client } from "@/types/client";
import { getClients } from "@/lib/api/coach/getClients"

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

type ClientFormData = {
  [K in keyof Omit<Client, "id" | "coach_id" | "user_id" | "created_at">]-?: string;
};

function toISODate(value: string): string {
  const ddmmyyyy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  return value;
}

function mapFormToFields(form: ClientFormData) {
  return {
    full_name: form.full_name.trim(),
    email: form.email.trim(),
    birth_date: toISODate(form.birth_date.trim()),
    gender: form.gender,
    weight_kg: Number(form.weight_kg),
    height_cm: Number(form.height_cm),
    goal: form.goal.trim() || null,
    active: form.active || null,
    calories_goal: form.calories_goal ? Number(form.calories_goal) : null,
    protein_goal: form.protein_goal ? Number(form.protein_goal) : null,
    carbs_goal: form.carbs_goal ? Number(form.carbs_goal) : null,
    fat_goal: form.fat_goal ? Number(form.fat_goal) : null,
    allergies: form.allergies.trim() ? form.allergies.split(",").map((a) => a.trim()).filter(Boolean) : null,
    preferences: form.preferences.trim() || null,
    notes: form.notes.trim() || null,
  };
}

export async function addClient(form: ClientFormData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("clients").insert({ coach_id: user.id, ...mapFormToFields(form) });
  if (error) throw new Error(error.message);
}

export async function addClientWithAccount(form: ClientFormData) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/clients/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(mapFormToFields(form)),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "Failed to create client account");
  }
}

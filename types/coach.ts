export type Coach = {
  id: string;
  full_name: string;
  email: string;
  logo_url?: string | null;
  brand_color?: string | null;
  created_at: string;
  invite_code: string;
  studio_id?: string | null;
  preferred_language?: string | null;
  sector: string;
};

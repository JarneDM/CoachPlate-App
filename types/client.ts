export type Client = {
  id: string;
  full_name: string;
  email: string;
  goal: string | null;
  calories_goal: number | null;
  protein_goal: number | null;
  carbs_goal: number | null;
  fat_goal: number | null;
  allergies: string[] | null;
  preferences: string | null;
};

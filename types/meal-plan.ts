export type Recipe = {
  id: string;
  name: string;
  meal_type: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  coach_id: string | null;
};

export type MealRecipe = {
  id: string;
  servings: number;
  recipes: Recipe;
};

export type Meal = {
  id: string;
  meal_type: string;
  meal_recipes: MealRecipe[];
};

export type Day = {
  id: string;
  day_number: number;
  date: string | null;
  meals: Meal[];
};

export type MealPlanClient = {
  id: string;
  full_name: string;
  calories_goal: number | null;
  protein_goal: number | null;
  carbs_goal: number | null;
  fat_goal: number | null;
} | null;

export type Plan = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  clients: MealPlanClient;
  meal_plan_days: Day[];
};

export type MealPlanSummary = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  clients: { full_name: string } | null;
};

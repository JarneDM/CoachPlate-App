import type { Client } from "@/types/client";
import { ClientResponse } from "./clientResponse"

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

export type MealPlan = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active?: boolean | null;
  clients?: Client | null;
  meal_plan_days?: Day[];
};

export type WeekPlan = {
  id: string
  name: string
  is_active: boolean
  created_at: string
  clients: ClientResponse
}
export type WeekPlanDashboard = {
  weekPlans: WeekPlan[]
  count: number
}

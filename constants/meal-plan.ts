export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MEAL_TYPES = ["ontbijt", "lunch", "avondeten", "snack"] as const;

export const MEAL_LABELS: Record<string, string> = {
  ontbijt: "Breakfast",
  lunch: "Lunch",
  avondeten: "Dinner",
  snack: "Snack",
};

export const MEAL_COLORS: Record<string, string> = {
  ontbijt: "#f97316",
  lunch: "#eab308",
  avondeten: "#3b82f6",
  snack: "#22c55e",
};

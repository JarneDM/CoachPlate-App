export const GENDER_LABELS: Record<string, string> = {
  FEMALE: "Female",
  MALE: "Male",
  OTHER: "Other",
};

export const ACTIVITY_LABELS: Record<string, string> = {
  SEDENTARY: "Little to no exercise",
  LIGHT: "Lightly active (1-3 days/week)",
  MODERATE: "Moderately active (3-5 days/week)",
  ACTIVE: "Active (6-7 days/week)",
  VERY_ACTIVE: "Very active (daily intense exercise)",
};

export const GENDER_OPTIONS = Object.entries(GENDER_LABELS).map(([value, label]) => ({ value, label }));
export const ACTIVITY_OPTIONS = Object.entries(ACTIVITY_LABELS).map(([value, label]) => ({ value, label }));

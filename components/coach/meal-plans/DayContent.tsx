import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MacroPill } from "./MacroPill";
import { MealSlot } from "./MealSlot";
import { MEAL_TYPES, MEAL_LABELS, MEAL_COLORS } from "@/constants/meal-plan";
import type { Day } from "@/types/meal-plan";

type DayTotals = { calories: number; protein: number; carbs: number; fat: number };

export function DayContent({
  currentDay,
  totals,
  calorieGoal,
  calorieProgress,
  onRemoveRecipe,
  onAddRecipe,
}: {
  currentDay: Day | null;
  totals: DayTotals | null;
  calorieGoal: number | null;
  calorieProgress: number | null;
  onRemoveRecipe: (id: string) => void;
  onAddRecipe: (dayId: string, mealType: string) => void;
}) {
  if (!currentDay) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>No days in this plan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.dayScroll} contentContainerStyle={styles.dayScrollContent} showsVerticalScrollIndicator={false}>
      {totals && (
        <View style={styles.macroCard}>
          {calorieProgress !== null && (
            <View style={styles.calorieRow}>
              <View style={styles.calorieText}>
                <Text style={styles.calorieValue}>{Math.round(totals.calories)} kcal</Text>
                {calorieGoal && <Text style={styles.calorieGoal}>/ {calorieGoal}</Text>}
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${calorieProgress}%` as any,
                      backgroundColor:
                        calorieProgress >= 90 ? "#22c55e" : calorieProgress >= 60 ? "#eab308" : "#ef4444",
                    },
                  ]}
                />
              </View>
            </View>
          )}
          <View style={styles.macroRow}>
            <MacroPill label="Protein" value={Math.round(totals.protein)} unit="g" color="#3b82f6" />
            <MacroPill label="Carbs" value={Math.round(totals.carbs)} unit="g" color="#eab308" />
            <MacroPill label="Fat" value={Math.round(totals.fat)} unit="g" color="#ef4444" />
          </View>
        </View>
      )}

      {MEAL_TYPES.map((mealType) => {
        const meal = currentDay.meals.find((m) => m.meal_type === mealType);
        const mealRecipes = meal?.meal_recipes ?? [];
        return (
          <MealSlot
            key={mealType}
            label={MEAL_LABELS[mealType]}
            color={MEAL_COLORS[mealType]}
            mealRecipes={mealRecipes}
            onAdd={() => onAddRecipe(currentDay.id, mealType)}
            onRemove={onRemoveRecipe}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" },
  notFoundText: { fontSize: 14, color: "#9ca3af" },
  dayScroll: { flex: 1 },
  dayScrollContent: { padding: 16, gap: 12, paddingBottom: 40 },
  macroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  calorieRow: { gap: 6 },
  calorieText: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  calorieValue: { fontSize: 16, fontWeight: "700", color: "#111827" },
  calorieGoal: { fontSize: 13, color: "#9ca3af" },
  progressBar: {
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },
  macroRow: { flexDirection: "row", gap: 8 },
});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Plus, X } from "lucide-react-native";
import type { MealRecipe } from "@/types/meal-plan";

export function MealSlot({
  label,
  color,
  mealRecipes,
  onAdd,
  onRemove,
}: {
  label: string;
  color: string;
  mealRecipes: MealRecipe[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <View style={styles.mealSlot}>
      <View style={styles.mealSlotHeader}>
        <Text style={[styles.mealSlotLabel, { color }]}>{label}</Text>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn} activeOpacity={0.7}>
          <Plus size={12} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {mealRecipes.length > 0 ? (
        <View style={styles.recipeList}>
          {mealRecipes.map((mr) => (
            <View key={mr.id} style={styles.recipeRow}>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName} numberOfLines={1}>
                  {mr.recipes.name}
                </Text>
                <View style={styles.recipeMeta}>
                  {mr.servings !== 1 && <Text style={styles.servingsText}>×{mr.servings}</Text>}
                  {mr.recipes.calories && (
                    <Text style={styles.caloriesText}>{Math.round(mr.recipes.calories * mr.servings)} kcal</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => onRemove(mr.id)} style={styles.removeBtn} activeOpacity={0.7}>
                <X size={12} color="#d1d5db" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <TouchableOpacity onPress={onAdd} style={styles.emptySlot} activeOpacity={0.7}>
          <Text style={styles.emptySlotText}>+ Add recipe</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mealSlot: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  mealSlotHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mealSlotLabel: { fontSize: 13, fontWeight: "600" },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  recipeList: { gap: 6 },
  recipeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  recipeInfo: { flex: 1, minWidth: 0 },
  recipeName: { fontSize: 13, fontWeight: "500", color: "#111827" },
  recipeMeta: { flexDirection: "row", gap: 6, marginTop: 2 },
  servingsText: { fontSize: 12, color: "#9ca3af" },
  caloriesText: { fontSize: 12, color: "#f97316" },
  removeBtn: { padding: 4 },
  emptySlot: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed" as const,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  emptySlotText: { fontSize: 13, color: "#9ca3af" },
});

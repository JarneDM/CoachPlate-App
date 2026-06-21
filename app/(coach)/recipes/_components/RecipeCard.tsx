import { View, Text, TouchableOpacity } from "react-native";
import { NotepadText, ChefHat, Pencil, Trash2 } from "lucide-react-native";
import type { Recipe } from "@/types/meal-plan";
import { MEAL_LABELS, MEAL_COLORS } from "@/constants/meal-plan";
import styles from "./RecipeCard.styles";

type Props = {
  recipe: Recipe;
  isOwn: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function RecipeCard({ recipe, isOwn, onEdit, onDelete }: Props) {
  const mealColor = recipe.meal_type ? MEAL_COLORS[recipe.meal_type] : "#9ca3af";
  const mealLabel = recipe.meal_type ? MEAL_LABELS[recipe.meal_type] : null;

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.iconWrapper, { backgroundColor: isOwn ? "#f3f4f6" : "#f0fdf4" }]}>
          {isOwn ? (
            <NotepadText size={20} color="#6b7280" />
          ) : (
            <ChefHat size={20} color="#16a34a" />
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
            {mealLabel ? (
              <View style={[styles.badge, { backgroundColor: mealColor + "33" }]}>
                <Text style={[styles.badgeText, { color: mealColor }]}>{mealLabel}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.macros} numberOfLines={1}>
            {recipe.calories != null ? `${recipe.calories} kcal` : "—"}{" · "}
            {recipe.protein_g != null ? `${recipe.protein_g}g P` : "—"}{" · "}
            {recipe.carbs_g != null ? `${recipe.carbs_g}g C` : "—"}{" · "}
            {recipe.fat_g != null ? `${recipe.fat_g}g F` : "—"}
          </Text>
        </View>
      </View>
      {isOwn ? (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} activeOpacity={0.7} style={styles.actionBtn}>
            <Pencil size={15} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} activeOpacity={0.7} style={styles.actionBtn}>
            <Trash2 size={15} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import styles from "./DayItem.styles";
import { GeneratedDay } from "@/lib/api/mealplan/mealplan";

type DayItemProps = {
  day: GeneratedDay;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
};

const MEAL_LABELS: Record<string, string> = {
  ontbijt: "Breakfast",
  lunch: "Lunch",
  avondeten: "Dinner",
  snack: "Snack",
};

const MEAL_COLORS: Record<string, string> = {
  ontbijt: "#f97316",
  lunch: "#eab308",
  avondeten: "#3b82f6",
  snack: "#16a34a",
};

function DayItem({ day, isOpen, isLast, onToggle }: DayItemProps) {
  const totalKcal = Object.values(day.meals).reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = Object.values(day.meals).reduce((sum, m) => sum + m.protein_g, 0);

  return (
    <View>
      <TouchableOpacity onPress={onToggle} style={[styles.dayRow, (!isLast || isOpen) && styles.dayRowBorder]} activeOpacity={0.6}>
        <Text style={styles.dayName}>{day.day}</Text>
        <View style={styles.dayRight}>
          <Text style={styles.dayKcal}>{Math.round(totalKcal)} kcal</Text>
          <Text style={styles.dayProtein}>{Math.round(totalProtein)}g P</Text>
          {isOpen ? <ChevronUp size={14} color="#d1d5db" /> : <ChevronDown size={14} color="#d1d5db" />}
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.mealsContainer, !isLast && styles.mealsContainerBorder]}>
          {(["ontbijt", "lunch", "avondeten", "snack"] as const).map((mealType, i) => {
            const meal = day.meals[mealType];
            const color = MEAL_COLORS[mealType];
            return (
              <View key={mealType} style={[styles.mealRow, i < 3 && styles.mealRowBorder]}>
                <View style={[styles.mealDot, { backgroundColor: color }]} />
                <View style={styles.mealInfo}>
                  <View style={styles.mealHeader}>
                    <Text style={[styles.mealType, { color }]}>{MEAL_LABELS[mealType]}</Text>
                    <Text style={styles.mealKcal}>{meal.calories} kcal</Text>
                  </View>
                  <Text style={styles.mealName} numberOfLines={1}>
                    {meal.name}
                  </Text>
                  <Text style={styles.mealMacros}>
                    {meal.protein_g}g P · {meal.carbs_g}g C · {meal.fat_g}g F
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default DayItem;
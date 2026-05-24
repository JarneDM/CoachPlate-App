import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";
import { useMealPlan } from "@/hooks/useMealPlan";
import LoadingScreen from "@/components/LoadingScreen";
import NotFoundScreen from "@/components/NotFoundScreen";
import { formatDate } from "@/utils/formatDate";
import { DAY_NAMES, MEAL_TYPES, MEAL_LABELS, MEAL_COLORS } from "@/constants/meal-plan";

export default function ClientMealPlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { plan, days, loading } = useMealPlan(id);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (loading) return <LoadingScreen />;
  if (!plan) return <NotFoundScreen message="Plan not found." />;

  const currentDay = days[selectedDayIndex] ?? null;

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>
        <View style={styles.topBarMid}>
          <Text style={styles.planName} numberOfLines={1}>
            {plan.name}
          </Text>
          {plan.start_date && (
            <View style={styles.topBarMeta}>
              <Clock size={11} color="#9ca3af" />
              <Text style={styles.topBarMetaText}>
                {formatDate(plan.start_date)}
                {plan.end_date ? ` → ${formatDate(plan.end_date)}` : ""}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayBar}
        contentContainerStyle={styles.dayBarContent}
      >
        {days.map((day, index) => {
          const active = index === selectedDayIndex;
          return (
            <TouchableOpacity
              key={day.id}
              onPress={() => setSelectedDayIndex(index)}
              style={[styles.dayTab, active && styles.dayTabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayTabLabel, active && styles.dayTabLabelActive]}>
                {DAY_NAMES[day.day_number - 1]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {currentDay ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {MEAL_TYPES.map((mealType) => {
            const meal = currentDay.meals.find((m) => m.meal_type === mealType);
            const mealRecipes = meal?.meal_recipes ?? [];
            const color = MEAL_COLORS[mealType];
            return (
              <View key={mealType} style={styles.mealCard}>
                <Text style={[styles.mealLabel, { color }]}>{MEAL_LABELS[mealType]}</Text>
                {mealRecipes.length > 0 ? (
                  <View style={styles.recipeList}>
                    {mealRecipes.map((mr) => (
                      <View key={mr.id} style={styles.recipeRow}>
                        <View style={styles.recipeInfo}>
                          <Text style={styles.recipeName} numberOfLines={1}>
                            {mr.recipes.name}
                          </Text>
                          {mr.recipes.calories && (
                            <Text style={styles.recipeMeta}>
                              {Math.round(mr.recipes.calories * mr.servings)} kcal
                              {mr.servings !== 1 && ` · ×${mr.servings}`}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>Nothing planned</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.center}>
          <Text style={styles.centerText}>No days in this plan.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  backBtn: { padding: 4 },
  topBarMid: { flex: 1, minWidth: 0 },
  planName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  topBarMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  topBarMetaText: { fontSize: 12, color: "#9ca3af" },
  dayBar: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    flexGrow: 0,
  },
  dayBarContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  dayTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 52,
  },
  dayTabActive: { backgroundColor: "#f0fdf4" },
  dayTabLabel: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  dayTabLabelActive: { color: "#15803d" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 40 },
  mealCard: {
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
  mealLabel: { fontSize: 13, fontWeight: "600", marginBottom: 10 },
  recipeList: { gap: 6 },
  recipeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 10,
  },
  recipeInfo: { flex: 1, minWidth: 0 },
  recipeName: { fontSize: 13, fontWeight: "500", color: "#111827" },
  recipeMeta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  emptyText: { fontSize: 13, color: "#9ca3af" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  centerText: { fontSize: 14, color: "#9ca3af" },
});

import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Clock, User } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mealPlanOptions, addRecipeToMeal, removeRecipeFromMeal } from "@/lib/query-options";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useRecipes } from "@/hooks/useRecipes";
import LoadingScreen from "@/components/LoadingScreen";
import NotFoundScreen from "@/components/NotFoundScreen";
import { DayBar } from "@/components/coach/meal-plans/DayBar";
import { DayContent } from "@/components/coach/meal-plans/DayContent";
import { RecipePicker } from "@/components/coach/meal-plans/RecipePicker";
import { formatDate } from "@/utils/formatDate";
import type { Day } from "@/types/meal-plan";

export default function WeekPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { plan, days, loading } = useMealPlan(id);
  const { recipes, userId } = useRecipes();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ dayId: string; mealType: string } | null>(null);

  const invalidatePlan = () => queryClient.invalidateQueries(mealPlanOptions(id));

  const addMutation = useMutation({
    mutationFn: addRecipeToMeal,
    onSuccess: () => {
      invalidatePlan();
      setPickerOpen(false);
      setPickerTarget(null);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeRecipeFromMeal,
    onSuccess: invalidatePlan,
  });

  const dayTotals = (day: Day) => {
    const all = day.meals.flatMap((m) => m.meal_recipes);
    return all.reduce(
      (acc, mr) => ({
        calories: acc.calories + (mr.recipes.calories ?? 0) * mr.servings,
        protein: acc.protein + (mr.recipes.protein_g ?? 0) * mr.servings,
        carbs: acc.carbs + (mr.recipes.carbs_g ?? 0) * mr.servings,
        fat: acc.fat + (mr.recipes.fat_g ?? 0) * mr.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  };

  if (loading) return <LoadingScreen />;
  if (!plan) return <NotFoundScreen message="Plan not found." />;

  const saving = addMutation.isPending || removeMutation.isPending;
  const currentDay = days[selectedDayIndex] ?? null;
  const totals = currentDay ? dayTotals(currentDay) : null;
  const calorieGoal = plan.clients?.calories_goal ?? null;
  const calorieProgress = totals && calorieGoal ? Math.min((totals.calories / calorieGoal) * 100, 100) : null;

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
          {plan.clients?.full_name && (
            <View style={styles.topBarMeta}>
              <User size={11} color="#9ca3af" />
              <Text style={styles.topBarMetaText}>{plan.clients.full_name}</Text>
              {plan.start_date && (
                <>
                  <Text style={styles.topBarMetaDot}>·</Text>
                  <Clock size={11} color="#9ca3af" />
                  <Text style={styles.topBarMetaText}>
                    {formatDate(plan.start_date)}
                    {plan.end_date ? ` → ${formatDate(plan.end_date)}` : ""}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
        {saving && <ActivityIndicator size="small" color="#16a34a" />}
      </View>

      <DayBar
        days={days}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
        getDayTotals={dayTotals}
      />

      <DayContent
        currentDay={currentDay}
        totals={totals}
        calorieGoal={calorieGoal}
        calorieProgress={calorieProgress}
        onRemoveRecipe={(mealRecipeId) => removeMutation.mutate(mealRecipeId)}
        onAddRecipe={(dayId, mealType) => {
          setPickerTarget({ dayId, mealType });
          setPickerOpen(true);
        }}
      />

      {pickerOpen && pickerTarget && (
        <RecipePicker
          recipes={recipes}
          mealType={pickerTarget.mealType}
          currentUserId={userId}
          onSelect={(recipeId, servings) =>
            addMutation.mutate({ recipeId, servings, dayId: pickerTarget.dayId, mealType: pickerTarget.mealType })
          }
          onClose={() => {
            setPickerOpen(false);
            setPickerTarget(null);
          }}
        />
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
  topBarMetaDot: { fontSize: 12, color: "#d1d5db" },
});

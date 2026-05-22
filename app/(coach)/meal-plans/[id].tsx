import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase/supabase";
import { ArrowLeft, Plus, Search, X, ChefHat, NotepadText, User, Clock } from "lucide-react-native";


type Recipe = {
  id: string;
  name: string;
  meal_type: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  coach_id: string | null;
};

type MealRecipe = {
  id: string;
  servings: number;
  recipes: Recipe;
};

type Meal = {
  id: string;
  meal_type: string;
  meal_recipes: MealRecipe[];
};

type Day = {
  id: string;
  day_number: number;
  date: string | null;
  meals: Meal[];
};

type Client = {
  id: string;
  full_name: string;
  calories_goal: number | null;
  protein_goal: number | null;
  carbs_goal: number | null;
  fat_goal: number | null;
} | null;

type Plan = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  clients: Client;
  meal_plan_days: Day[];
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES = ["ontbijt", "lunch", "avondeten", "snack"] as const;
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
  snack: "#22c55e",
};

export default function WeekPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ dayId: string; mealType: string } | null>(null);

  const userId = useRef<string | null>(null);

  const fetchPlan = useCallback(async () => {
    const { data: raw } = await supabase
      .from("meal_plans")
      .select(
        `
        id, name, start_date, end_date,
        clients (id, full_name, calories_goal, protein_goal, carbs_goal, fat_goal),
        meal_plan_days (
          id, day_number, date,
          meals (
            id, meal_type,
            meal_recipes (
              id, servings,
              recipes (id, name, meal_type, calories, protein_g, carbs_g, fat_g, coach_id)
            )
          )
        )
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (!raw) return;

    const sorted = [...((raw as any).meal_plan_days ?? [])].sort(
      (a: Day, b: Day) => a.day_number - b.day_number
    );

    setPlan(raw as any);
    setDays(sorted);
    setLoading(false);
  }, [id]);

  const fetchRecipes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    userId.current = user.id;

    const { data: coachRecipes } = await supabase
      .from("recipes")
      .select("id, name, meal_type, calories, protein_g, carbs_g, fat_g, coach_id")
      .eq("coach_id", user.id);

    const { data: publicRecipes } = await supabase
      .from("recipes")
      .select("id, name, meal_type, calories, protein_g, carbs_g, fat_g, coach_id")
      .eq("is_public", true);

    const all = [...(coachRecipes ?? []), ...(publicRecipes ?? [])];
    const unique = Array.from(new Map(all.map((r) => [r.id, r])).values());
    setRecipes(unique as Recipe[]);
  }, []);

  useEffect(() => {
    fetchPlan();
    fetchRecipes();
  }, [fetchPlan, fetchRecipes]);

  async function addRecipe(recipeId: string, servings: number) {
    if (!pickerTarget) return;
    setSaving(true);

    const day = days.find((d) => d.id === pickerTarget.dayId);
    let meal = day?.meals.find((m) => m.meal_type === pickerTarget.mealType);

    if (!meal) {
      const { data: newMeal, error } = await supabase
        .from("meals")
        .insert({ meal_plan_day_id: pickerTarget.dayId, meal_type: pickerTarget.mealType })
        .select("id, meal_type")
        .single();

      if (error || !newMeal) {
        setSaving(false);
        return;
      }
      meal = { ...newMeal, meal_recipes: [] };
    }

    await supabase.from("meal_recipes").insert({ meal_id: meal.id, recipe_id: recipeId, servings });

    setPickerOpen(false);
    setPickerTarget(null);
    await fetchPlan();
    setSaving(false);
  }

  async function removeRecipe(mealRecipeId: string) {
    setSaving(true);
    await supabase.from("meal_recipes").delete().eq("id", mealRecipeId);
    await fetchPlan();
    setSaving(false);
  }
  const currentDay = days[selectedDayIndex] ?? null;

  const dayTotals = (day: Day) => {
    const all = day.meals.flatMap((m) => m.meal_recipes);
    return all.reduce(
      (acc, mr) => ({
        calories: acc.calories + (mr.recipes.calories ?? 0) * mr.servings,
        protein: acc.protein + (mr.recipes.protein_g ?? 0) * mr.servings,
        carbs: acc.carbs + (mr.recipes.carbs_g ?? 0) * mr.servings,
        fat: acc.fat + (mr.recipes.fat_g ?? 0) * mr.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Plan not found.</Text>
      </View>
    );
  }

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
                    {new Date(plan.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {plan.end_date
                      ? ` → ${new Date(plan.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                      : ""}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
        {saving && <ActivityIndicator size="small" color="#16a34a" />}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayBar}
        contentContainerStyle={styles.dayBarContent}
      >
        {days.map((day, index) => {
          const active = index === selectedDayIndex;
          const t = dayTotals(day);
          const hasFood = t.calories > 0;
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
              {day.date && (
                <Text style={[styles.dayTabDate, active && styles.dayTabDateActive]}>
                  {new Date(day.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </Text>
              )}
              {hasFood && <View style={[styles.dayDot, active && styles.dayDotActive]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {currentDay ? (
        <ScrollView
          style={styles.dayScroll}
          contentContainerStyle={styles.dayScrollContent}
          showsVerticalScrollIndicator={false}
        >
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
                            calorieProgress >= 90
                              ? "#22c55e"
                              : calorieProgress >= 60
                              ? "#eab308"
                              : "#ef4444",
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
                mealType={mealType}
                label={MEAL_LABELS[mealType]}
                color={MEAL_COLORS[mealType]}
                mealRecipes={mealRecipes}
                onAdd={() => {
                  setPickerTarget({ dayId: currentDay.id, mealType });
                  setPickerOpen(true);
                }}
                onRemove={removeRecipe}
              />
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.center}>
          <Text style={styles.notFoundText}>No days in this plan.</Text>
        </View>
      )}

      {pickerOpen && pickerTarget && (
        <RecipePicker
          recipes={recipes}
          mealType={pickerTarget.mealType}
          currentUserId={userId.current}
          onSelect={addRecipe}
          onClose={() => {
            setPickerOpen(false);
            setPickerTarget(null);
          }}
        />
      )}
    </View>
  );
}

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={styles.macroPill}>
      <Text style={[styles.macroPillValue, { color }]}>
        {value}
        {unit}
      </Text>
      <Text style={styles.macroPillLabel}>{label}</Text>
    </View>
  );
}

function MealSlot({
  mealType,
  label,
  color,
  mealRecipes,
  onAdd,
  onRemove,
}: {
  mealType: string;
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
                    <Text style={styles.caloriesText}>
                      {Math.round(mr.recipes.calories * mr.servings)} kcal
                    </Text>
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

function RecipePicker({
  recipes,
  mealType,
  currentUserId,
  onSelect,
  onClose,
}: {
  recipes: Recipe[];
  mealType: string;
  currentUserId: string | null;
  onSelect: (recipeId: string, servings: number) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(1);

  const filtered = recipes
    .filter((r) => r.meal_type === mealType)
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={picker.overlay}>
        <View style={picker.sheet}>
          <View style={picker.handle} />

          <View style={picker.titleRow}>
            <View>
              <Text style={picker.title}>Add recipe</Text>
              <Text style={picker.subtitle}>{MEAL_LABELS[mealType]}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={picker.closeBtn} activeOpacity={0.7}>
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={picker.searchWrap}>
            <Search size={14} color="#9ca3af" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search recipe..."
              placeholderTextColor="#9ca3af"
              style={picker.searchInput}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(r) => r.id}
            style={picker.list}
            contentContainerStyle={picker.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={picker.empty}>
                <Text style={picker.emptyText}>{recipes.length === 0 ? "No recipes yet" : "No recipes found"}</Text>
              </View>
            }
            renderItem={({ item: recipe }) => {
              const isCoach = recipe.coach_id === currentUserId;
              const isSelected = selected?.id === recipe.id;
              return (
                <TouchableOpacity
                  onPress={() => setSelected(recipe)}
                  style={[picker.recipeItem, isSelected && picker.recipeItemSelected]}
                  activeOpacity={0.7}
                >
                  <View style={[picker.recipeIcon, isCoach ? picker.recipeIconCoach : picker.recipeIconPublic]}>
                    {isCoach ? <NotepadText size={14} color="#6b7280" /> : <ChefHat size={14} color="#16a34a" />}
                  </View>
                  <View style={picker.recipeText}>
                    <Text style={picker.recipeName} numberOfLines={1}>
                      {recipe.name}
                    </Text>
                    {recipe.calories && (
                      <Text style={picker.recipeMacros}>
                        {recipe.calories} kcal · {recipe.protein_g}g P · {recipe.carbs_g}g C · {recipe.fat_g}g F
                      </Text>
                    )}
                  </View>
                  {isSelected && <View style={picker.checkDot} />}
                </TouchableOpacity>
              );
            }}
          />

          {selected && (
            <View style={picker.footer}>
              <View style={picker.servingsRow}>
                <Text style={picker.servingsLabel}>Servings</Text>
                <View style={picker.servingsControl}>
                  <TouchableOpacity
                    onPress={() => setServings((s) => Math.max(0.5, +(s - 0.5).toFixed(1)))}
                    style={picker.servingsBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={picker.servingsBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={picker.servingsValue}>{servings}</Text>
                  <TouchableOpacity
                    onPress={() => setServings((s) => +(s + 0.5).toFixed(1))}
                    style={picker.servingsBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={picker.servingsBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {selected.calories && (
                <View style={picker.macroPreview}>
                  <MacroPreviewPill value={Math.round(selected.calories * servings)} label="kcal" color="#f97316" />
                  <MacroPreviewPill value={Math.round((selected.protein_g ?? 0) * servings)} label="P" color="#3b82f6" />
                  <MacroPreviewPill value={Math.round((selected.carbs_g ?? 0) * servings)} label="C" color="#eab308" />
                  <MacroPreviewPill value={Math.round((selected.fat_g ?? 0) * servings)} label="F" color="#ef4444" />
                </View>
              )}

              <TouchableOpacity onPress={() => onSelect(selected.id, servings)} style={picker.confirmBtn} activeOpacity={0.8}>
                <Text style={picker.confirmText}>Add to {MEAL_LABELS[mealType].toLowerCase()}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function MacroPreviewPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={picker.previewPill}>
      <Text style={[picker.previewValue, { color }]}>{value}</Text>
      <Text style={picker.previewLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" },
  notFoundText: { fontSize: 14, color: "#9ca3af" },

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
  dayTabDate: { fontSize: 10, color: "#d1d5db", marginTop: 2 },
  dayTabDateActive: { color: "#86efac" },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    marginTop: 4,
  },
  dayDotActive: { backgroundColor: "#16a34a" },

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
  macroPill: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  macroPillValue: { fontSize: 14, fontWeight: "700" },
  macroPillLabel: { fontSize: 11, color: "#9ca3af", marginTop: 1 },

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

const picker = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.5)",
    justifyContent: "flex-end",
    height: "90%",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "100%",
    height: "80%",
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  list: { maxHeight: "auto" },
  listContent: { paddingHorizontal: 12, paddingBottom: 8, gap: 4 },
  empty: { alignItems: "center", paddingVertical: 32 },
  emptyText: { fontSize: 14, color: "#9ca3af" },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  recipeItemSelected: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  recipeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recipeIconCoach: { backgroundColor: "#f3f4f6" },
  recipeIconPublic: { backgroundColor: "#f0fdf4" },
  recipeText: { flex: 1, minWidth: 0 },
  recipeName: { fontSize: 14, fontWeight: "500", color: "#111827" },
  recipeMacros: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  checkDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#16a34a",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 16,
    gap: 12,
    backgroundColor: "#f9fafb",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  servingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  servingsLabel: { fontSize: 14, color: "#374151" },
  servingsControl: { flexDirection: "row", alignItems: "center", gap: 12 },
  servingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  servingsBtnText: { fontSize: 18, color: "#374151", lineHeight: 22 },
  servingsValue: { fontSize: 15, fontWeight: "700", color: "#111827", minWidth: 28, textAlign: "center" },
  macroPreview: { flexDirection: "row", gap: 8 },
  previewPill: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  previewValue: { fontSize: 14, fontWeight: "700" },
  previewLabel: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  confirmBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  confirmText: { fontSize: 15, fontWeight: "600", color: "#ffffff" },
});

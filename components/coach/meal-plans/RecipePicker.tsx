import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ChefHat, NotepadText, Search, X } from "lucide-react-native";
import { MEAL_LABELS } from "@/constants/meal-plan";
import type { Recipe } from "@/types/meal-plan";

export function RecipePicker({
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
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Add recipe</Text>
              <Text style={styles.subtitle}>{MEAL_LABELS[mealType]}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <Search size={14} color="#9ca3af" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search recipe..."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(r) => r.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{recipes.length === 0 ? "No recipes yet" : "No recipes found"}</Text>
              </View>
            }
            renderItem={({ item: recipe }) => {
              const isCoach = recipe.coach_id === currentUserId;
              const isSelected = selected?.id === recipe.id;
              return (
                <TouchableOpacity
                  onPress={() => setSelected(recipe)}
                  style={[styles.recipeItem, isSelected && styles.recipeItemSelected]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.recipeIcon, isCoach ? styles.recipeIconCoach : styles.recipeIconPublic]}>
                    {isCoach ? <NotepadText size={14} color="#6b7280" /> : <ChefHat size={14} color="#16a34a" />}
                  </View>
                  <View style={styles.recipeText}>
                    <Text style={styles.recipeName} numberOfLines={1}>
                      {recipe.name}
                    </Text>
                    {recipe.calories && (
                      <Text style={styles.recipeMacros}>
                        {recipe.calories} kcal · {recipe.protein_g}g P · {recipe.carbs_g}g C · {recipe.fat_g}g F
                      </Text>
                    )}
                  </View>
                  {isSelected && <View style={styles.checkDot} />}
                </TouchableOpacity>
              );
            }}
          />

          {selected && (
            <View style={styles.footer}>
              <View style={styles.servingsRow}>
                <Text style={styles.servingsLabel}>Servings</Text>
                <View style={styles.servingsControl}>
                  <TouchableOpacity
                    onPress={() => setServings((s) => Math.max(0.5, +(s - 0.5).toFixed(1)))}
                    style={styles.servingsBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.servingsBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.servingsValue}>{servings}</Text>
                  <TouchableOpacity
                    onPress={() => setServings((s) => +(s + 0.5).toFixed(1))}
                    style={styles.servingsBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.servingsBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {selected.calories && (
                <View style={styles.macroPreview}>
                  <MacroPreviewPill value={Math.round(selected.calories * servings)} label="kcal" color="#f97316" />
                  <MacroPreviewPill value={Math.round((selected.protein_g ?? 0) * servings)} label="P" color="#3b82f6" />
                  <MacroPreviewPill value={Math.round((selected.carbs_g ?? 0) * servings)} label="C" color="#eab308" />
                  <MacroPreviewPill value={Math.round((selected.fat_g ?? 0) * servings)} label="F" color="#ef4444" />
                </View>
              )}

              <TouchableOpacity
                onPress={() => onSelect(selected.id, servings)}
                style={styles.confirmBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>Add to {MEAL_LABELS[mealType].toLowerCase()}</Text>
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
    <View style={styles.previewPill}>
      <Text style={[styles.previewValue, { color }]}>{value}</Text>
      <Text style={styles.previewLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

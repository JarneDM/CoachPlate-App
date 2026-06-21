import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, ChefHat } from "lucide-react-native";
import { router } from "expo-router";
import { useCoachRecipes, usePublicRecipes } from "@/hooks/useRecipes";
import { useUser } from "@/hooks/auth/useUser";
import { AlertModal } from "@/components/AlertModal";
import type { Recipe } from "@/types/meal-plan";
import RecipeCard from "./_components/RecipeCard";
import styles from "./index.styles";

type Tab = "my-recipes" | "public-recipes";

export default function RecipesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("my-recipes");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useUser();
  const { coachRecipes, isLoading: loadingOwn } = useCoachRecipes({ coachId: user?.id ?? "" });
  const { publicRecipes, isLoading: loadingPublic } = usePublicRecipes();

  const recipes = activeTab === "my-recipes" ? coachRecipes : publicRecipes;
  const isLoadingCurrent = activeTab === "my-recipes" ? loadingOwn : loadingPublic;
  const count = recipes.length;

  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      isOwn={activeTab === "my-recipes"}
      onEdit={() => router.push({ pathname: "/(coach)/recipes/[id]/edit", params: { id: item.id } })}
      onDelete={() => setDeleteId(item.id)}
    />
  );

  const ListEmpty = isLoadingCurrent ? (
    <ActivityIndicator color="#16a34a" style={{ marginTop: 24 }} />
  ) : (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <ChefHat size={28} color="#16a34a" />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === "my-recipes" ? "No recipes yet" : "No public recipes"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "my-recipes"
          ? "Create your first recipe to get started."
          : "No public recipes are available yet."}
      </Text>
      {activeTab === "my-recipes" ? (
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/(coach)/recipes/add")}>
          <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyButton}>
            <Plus size={14} color="#ffffff" />
            <Text style={styles.emptyButtonText}>Add first recipe</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Recipes</Text>
            <Text style={styles.subtitle}>
              {count} {count === 1 ? "recipe" : "recipes"}
            </Text>
          </View>
          {activeTab === "my-recipes" ? (
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/(coach)/recipes/add")}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
                <Plus size={14} color="#ffffff" />
                <Text style={styles.addButtonText}>Add recipe</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "my-recipes" && styles.tabActive]}
            onPress={() => setActiveTab("my-recipes")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "my-recipes" && styles.tabTextActive]}>My Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "public-recipes" && styles.tabActive]}
            onPress={() => setActiveTab("public-recipes")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "public-recipes" && styles.tabTextActive]}>Public</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={isLoadingCurrent ? [] : recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={ListEmpty}
      />

      <AlertModal
        visible={!!deleteId}
        title="Delete recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </View>
  );
}

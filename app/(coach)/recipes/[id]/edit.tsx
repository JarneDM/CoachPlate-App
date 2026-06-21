import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Pencil } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { useCoachRecipes } from "@/hooks/useRecipes";
import { useUser } from "@/hooks/auth/useUser";
import { RecipeFormFields } from "../_components/RecipeFormFields";
import type { RecipeForm } from "../_components/RecipeFormFields";
import { styles } from "../_components/recipeForm.styles";

export default function EditRecipe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [focusedField, setFocusedField] = useState<keyof RecipeForm | null>(null);
  const { user } = useUser();
  const { coachRecipes, isLoading } = useCoachRecipes({ coachId: user?.id ?? "" });

  const recipe = coachRecipes.find((r) => r.id === id);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<RecipeForm>({
    defaultValues: {
      name: "",
      meal_type: "",
      calories: "",
      protein_g: "",
      carbs_g: "",
      fat_g: "",
    },
  });

  useEffect(() => {
    if (recipe) {
      reset({
        name: recipe.name,
        meal_type: recipe.meal_type ?? "",
        calories: recipe.calories?.toString() ?? "",
        protein_g: recipe.protein_g?.toString() ?? "",
        carbs_g: recipe.carbs_g?.toString() ?? "",
        fat_g: recipe.fat_g?.toString() ?? "",
      });
    }
  }, [recipe, reset]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  const onSubmit = (_data: RecipeForm) => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Edit recipe</Text>

        <RecipeFormFields
          control={control}
          errors={errors}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButtonWrapper} activeOpacity={0.8} onPress={handleSubmit(onSubmit)}>
            <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButton}>
              <Pencil size={15} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

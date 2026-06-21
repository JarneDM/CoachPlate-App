import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, ChefHat } from "lucide-react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { RecipeFormFields } from "./_components/RecipeFormFields";
import type { RecipeForm } from "./_components/RecipeFormFields";
import { styles } from "./_components/recipeForm.styles";

export default function AddRecipe() {
  const [focusedField, setFocusedField] = useState<keyof RecipeForm | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<RecipeForm>({
    defaultValues: {
      name: "",
      meal_type: "",
      calories: "",
      protein_g: "",
      carbs_g: "",
      fat_g: "",
    },
  });

  const onSubmit = (_data: RecipeForm) => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>New recipe</Text>

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
              <ChefHat size={15} color="#ffffff" />
              <Text style={styles.saveButtonText}>Add recipe</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

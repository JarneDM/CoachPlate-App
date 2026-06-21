import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { MEAL_TYPES, MEAL_LABELS } from "@/constants/meal-plan";
import { styles } from "./recipeForm.styles";

export type RecipeForm = {
  name: string;
  meal_type: string;
  calories: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
};

type Props = {
  control: Control<RecipeForm>;
  errors: FieldErrors<RecipeForm>;
  focusedField: keyof RecipeForm | null;
  setFocusedField: (field: keyof RecipeForm | null) => void;
};

export function RecipeFormFields({ control, errors, focusedField, setFocusedField }: Props) {
  const inputStyle = (field: keyof RecipeForm) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    errors[field] && styles.inputError,
  ];

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe details</Text>
        <View style={styles.fieldGroup}>
          <View>
            <Text style={styles.label}>Name *</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={inputStyle("name")}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  placeholder="E.g. Chicken salad"
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </View>
          <View>
            <Text style={styles.label}>Meal type</Text>
            <Controller
              control={control}
              name="meal_type"
              render={({ field: { onChange, value } }) => (
                <View style={styles.optionRow}>
                  {MEAL_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.optionChip, value === type && styles.optionChipSelected]}
                      onPress={() => onChange(value === type ? "" : type)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.optionChipText, value === type && styles.optionChipTextSelected]}>
                        {MEAL_LABELS[type]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition</Text>
        <View style={styles.fieldGroup}>
          <View>
            <Text style={styles.label}>Calories (kcal)</Text>
            <Controller
              control={control}
              name="calories"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={inputStyle("calories")}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => setFocusedField("calories")}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  placeholder="E.g. 450"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              )}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.fieldFlex}>
              <Text style={styles.label}>Protein (g)</Text>
              <Controller
                control={control}
                name="protein_g"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={inputStyle("protein_g")}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedField("protein_g")}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    placeholder="30"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <View style={styles.fieldFlex}>
              <Text style={styles.label}>Carbs (g)</Text>
              <Controller
                control={control}
                name="carbs_g"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={inputStyle("carbs_g")}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedField("carbs_g")}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    placeholder="40"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <View style={styles.fieldFlex}>
              <Text style={styles.label}>Fat (g)</Text>
              <Controller
                control={control}
                name="fat_g"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={inputStyle("fat_g")}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedField("fat_g")}
                    onBlur={() => { onBlur(); setFocusedField(null); }}
                    placeholder="15"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

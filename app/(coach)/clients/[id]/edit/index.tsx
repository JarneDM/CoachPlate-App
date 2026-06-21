import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Save } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClientById } from "@/hooks/coach/useClientById";
import { updateClient, clientByIdOptions, clientsOptions } from "@/lib/query-options";
import styles from "./index.styles"

function EditClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, loading } = useClientById(id);
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState(client?.full_name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [goal, setGoal] = useState(client?.goal ?? "");
  const [caloriesGoal, setCaloriesGoal] = useState(client?.calories_goal?.toString() ?? "");
  const [proteinGoal, setProteinGoal] = useState(client?.protein_goal?.toString() ?? "");
  const [carbsGoal, setCarbsGoal] = useState(client?.carbs_goal?.toString() ?? "");
  const [fatGoal, setFatGoal] = useState(client?.fat_goal?.toString() ?? "");
  const [allergies, setAllergies] = useState(client?.allergies?.join(", ") ?? "");
  const [preferences, setPreferences] = useState(client?.preferences ?? "");

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      updateClient(id, {
        full_name: fullName.trim(),
        email: email.trim(),
        goal: goal.trim() || null,
        calories_goal: caloriesGoal ? Number(caloriesGoal) : null,
        protein_goal: proteinGoal ? Number(proteinGoal) : null,
        carbs_goal: carbsGoal ? Number(carbsGoal) : null,
        fat_goal: fatGoal ? Number(fatGoal) : null,
        allergies: allergies.trim() ? allergies.split(",").map((a) => a.trim()).filter(Boolean) : null,
        preferences: preferences.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(clientByIdOptions(id));
      queryClient.invalidateQueries(clientsOptions);
      router.back();
    },
  });

  const inputStyle = (field: string) => [styles.input, focusedField === field && styles.inputFocused];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic details</Text>
          <View style={styles.fieldGroup}>
            <View>
              <Text style={styles.label}>Full name *</Text>
              <TextInput
                style={inputStyle("full_name")}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField("full_name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Full name"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={inputStyle("email")}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="email@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View>
              <Text style={styles.label}>Goal</Text>
              <TextInput
                style={inputStyle("goal")}
                value={goal}
                onChangeText={setGoal}
                onFocus={() => setFocusedField("goal")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Lose weight, Build muscle"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macro goals</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.row}>
              <View style={styles.fieldFlex}>
                <Text style={styles.label}>Calories (kcal)</Text>
                <TextInput
                  style={inputStyle("calories")}
                  value={caloriesGoal}
                  onChangeText={setCaloriesGoal}
                  onFocus={() => setFocusedField("calories")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="2000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.fieldFlex}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={inputStyle("protein")}
                  value={proteinGoal}
                  onChangeText={setProteinGoal}
                  onFocus={() => setFocusedField("protein")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="150"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.fieldFlex}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput
                  style={inputStyle("carbs")}
                  value={carbsGoal}
                  onChangeText={setCarbsGoal}
                  onFocus={() => setFocusedField("carbs")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="200"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.fieldFlex}>
                <Text style={styles.label}>Fats (g)</Text>
                <TextInput
                  style={inputStyle("fat")}
                  value={fatGoal}
                  onChangeText={setFatGoal}
                  onFocus={() => setFocusedField("fat")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="65"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition & notes</Text>
          <View style={styles.fieldGroup}>
            <View>
              <Text style={styles.label}>Allergies (comma separated)</Text>
              <TextInput
                style={inputStyle("allergies")}
                value={allergies}
                onChangeText={setAllergies}
                onFocus={() => setFocusedField("allergies")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. gluten, dairy, nuts"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View>
              <Text style={styles.label}>Preferences</Text>
              <TextInput
                style={[inputStyle("preferences"), styles.textArea]}
                value={preferences}
                onChangeText={setPreferences}
                onFocus={() => setFocusedField("preferences")}
                onBlur={() => setFocusedField(null)}
                placeholder="Dietary preferences, dislikes…"
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButtonWrapper} activeOpacity={0.8} onPress={() => mutation.mutate()} disabled={mutation.isPending || !fullName.trim()}>
            <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButton}>
              {mutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Save size={15} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default EditClient;

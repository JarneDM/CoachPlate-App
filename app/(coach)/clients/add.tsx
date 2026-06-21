import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient, addClientWithAccount, clientsOptions } from "@/lib/query-options";
import type { Client } from "@/types/client";
import { AlertModal } from "@/components/AlertModal";
import { GENDER_OPTIONS, ACTIVITY_OPTIONS } from "@/utils/client";
import styles from "./add.styles"

type ClientForm = {
  [K in keyof Omit<Client, "id" | "coach_id" | "user_id" | "created_at">]-?: string;
};

const STEP1_FIELDS: (keyof ClientForm)[] = ["full_name", "birth_date", "gender", "goal"];
const STEP2_FIELDS: (keyof ClientForm)[] = ["weight_kg", "height_cm"];

function AddClient() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [createAccount, setCreateAccount] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof ClientForm | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { control, handleSubmit, trigger, formState: { errors } } = useForm<ClientForm>({
    defaultValues: {
      full_name: "", email: "", birth_date: "", gender: "",
      weight_kg: "", height_cm: "", goal: "", active: "",
      calories_goal: "", protein_goal: "", carbs_goal: "", fat_goal: "",
      allergies: "", preferences: "", notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ClientForm) => createAccount ? addClientWithAccount(data) : addClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries(clientsOptions);
      router.back();
    },
    onError: (error: Error) => setErrorMessage(error.message),
  });

  const handleNext = async () => {
    const valid = await trigger(step === 1 ? STEP1_FIELDS : STEP2_FIELDS);
    if (valid) setStep(step + 1);
  };

  const inputStyle = (field: keyof ClientForm) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    errors[field] && styles.inputError,
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Add client</Text>
          <Text style={styles.stepIndicator}>{step} / 3</Text>
        </View>

        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic details</Text>
            <View style={styles.fieldGroup}>
              <View>
                <Text style={styles.label}>Full name *</Text>
                <Controller
                  control={control}
                  name="full_name"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={inputStyle("full_name")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("full_name")}
                      onBlur={() => { onBlur(); setFocusedField(null); }}
                      placeholder="E.g. Emma Johnson"
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              <View>
                <Text style={styles.label}>Email {createAccount && <Text style={styles.required}>*</Text>}</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: createAccount }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={inputStyle("email")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => { onBlur(); setFocusedField(null); }}
                      placeholder="emma@email.com"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
              </View>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setCreateAccount((v) => !v)} activeOpacity={0.7}>
                <View style={[styles.checkbox, createAccount && styles.checkboxChecked]}>
                  {createAccount && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Create client account</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.label}>Date of birth *</Text>
                <Controller
                  control={control}
                  name="birth_date"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={inputStyle("birth_date")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("birth_date")}
                      onBlur={() => { onBlur(); setFocusedField(null); }}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              <View>
                <Text style={styles.label}>Gender *</Text>
                <Controller
                  control={control}
                  name="gender"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.optionRow}>
                      {GENDER_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.optionChip, value === opt.value && styles.optionChipSelected, errors.gender && styles.optionChipError]}
                          onPress={() => onChange(opt.value)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.optionChipText, value === opt.value && styles.optionChipTextSelected]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </View>
              <View>
                <Text style={styles.label}>Goal *</Text>
                <Controller
                  control={control}
                  name="goal"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={inputStyle("goal")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("goal")}
                      onBlur={() => { onBlur(); setFocusedField(null); }}
                      placeholder="E.g. Fat loss"
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Body measurements</Text>
              <View style={styles.fieldGroup}>
                <View style={styles.row}>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.label}>Weight (kg) *</Text>
                    <Controller
                      control={control}
                      name="weight_kg"
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={inputStyle("weight_kg")}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("weight_kg")}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          placeholder="72.5"
                          placeholderTextColor="#9ca3af"
                          keyboardType="decimal-pad"
                        />
                      )}
                    />
                  </View>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.label}>Height (cm) *</Text>
                    <Controller
                      control={control}
                      name="height_cm"
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={inputStyle("height_cm")}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("height_cm")}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          placeholder="178"
                          placeholderTextColor="#9ca3af"
                          keyboardType="decimal-pad"
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity level</Text>
              <Controller
                control={control}
                name="active"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldGroup}>
                    {ACTIVITY_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.activityOption, value === opt.value && styles.activityOptionSelected]}
                        onPress={() => onChange(opt.value)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.activityRadio, value === opt.value && styles.activityRadioSelected]} />
                        <Text style={[styles.activityOptionText, value === opt.value && styles.activityOptionTextSelected]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Macro goals</Text>
              <View style={styles.fieldGroup}>
                <View style={styles.row}>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.label}>Calories (kcal)</Text>
                    <Controller
                      control={control}
                      name="calories_goal"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={inputStyle("calories_goal")}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("calories_goal")}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          placeholder="2200"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.label}>Protein (g)</Text>
                    <Controller
                      control={control}
                      name="protein_goal"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={inputStyle("protein_goal")}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("protein_goal")}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          placeholder="150"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.label}>Carbs (g)</Text>
                    <Controller
                      control={control}
                      name="carbs_goal"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={inputStyle("carbs_goal")}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("carbs_goal")}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          placeholder="220"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.label}>Fats (g)</Text>
                    <Controller
                      control={control}
                      name="fat_goal"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={inputStyle("fat_goal")}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setFocusedField("fat_goal")}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          placeholder="70"
                          placeholderTextColor="#9ca3af"
                          keyboardType="numeric"
                        />
                      )}
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
                  <Controller
                    control={control}
                    name="allergies"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={inputStyle("allergies")}
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocusedField("allergies")}
                        onBlur={() => { onBlur(); setFocusedField(null); }}
                        placeholder="Gluten, Lactose"
                        placeholderTextColor="#9ca3af"
                      />
                    )}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Preferences</Text>
                  <Controller
                    control={control}
                    name="preferences"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[inputStyle("preferences"), styles.textArea]}
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocusedField("preferences")}
                        onBlur={() => { onBlur(); setFocusedField(null); }}
                        placeholder="E.g. vegetarian, quick meals"
                        placeholderTextColor="#9ca3af"
                        multiline
                      />
                    )}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Notes</Text>
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[inputStyle("notes"), styles.textArea]}
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocusedField("notes")}
                        onBlur={() => { onBlur(); setFocusedField(null); }}
                        placeholder="Lifestyle, training, medical info…"
                        placeholderTextColor="#9ca3af"
                        multiline
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          {step < 3 ? (
            <TouchableOpacity style={styles.addButtonWrapper} activeOpacity={0.8} onPress={handleNext}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
                <Text style={styles.addButtonText}>Next</Text>
                <ArrowRight size={15} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButtonWrapper}
              activeOpacity={0.8}
              onPress={handleSubmit((data) => mutation.mutate(data))}
              disabled={mutation.isPending}
            >
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
                {mutation.isPending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <UserPlus size={15} color="#ffffff" />
                    <Text style={styles.addButtonText}>Add client</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <AlertModal
        visible={!!errorMessage}
        title="Something went wrong"
        message={errorMessage ?? ""}
        onConfirm={() => setErrorMessage(null)}
      />
    </View>
  );
}

export default AddClient;

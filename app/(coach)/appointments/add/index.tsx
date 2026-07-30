import { useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { ArrowLeft, Plus } from "lucide-react-native"
import { useForm, Controller } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addAppointmentMutationOptions, getAppointmentsQueryOptions } from "@/lib/query-options/appointments/appointments"
import { getClientsQueryOptions } from "@/lib/query-options/coach/clients"
import { AlertModal } from "@/components/AlertModal"
import { STATUS_LABELS } from "@/utils/appointment"
import type { Appointment, NewAppointment } from "@/types/appointment"
import { ClientPicker } from "./_components"
import styles from "./index.styles"

const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [Appointment["status"], string][]

function AddAppointment() {
  const queryClient = useQueryClient()
  const { data: clients = [], isLoading: isLoadingClients } = useQuery(getClientsQueryOptions)
  const [focusedField, setFocusedField] = useState<keyof Omit<NewAppointment, "status"> | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewAppointment>({
    defaultValues: {
      client_id: "",
      date: "",
      start_time: "",
      end_time: "",
      type: "",
      status: "open",
      notes: "",
      meeting_url: "",
    },
  })

  const formValues = watch()

  const { mutate, isPending } = useMutation({
    ...addAppointmentMutationOptions(formValues),
    onSuccess: () => {
      queryClient.invalidateQueries(getAppointmentsQueryOptions)
      router.back()
    },
    onError: (error: Error) => setErrorMessage(error.message),
  })

  const inputStyle = (field: keyof Omit<NewAppointment, "status">) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    errors[field] && styles.inputError,
  ]

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Add appointment</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Controller
            control={control}
            name="client_id"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <ClientPicker clients={clients} value={value} onChange={onChange} error={!!errors.client_id} />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.fieldGroup}>
            <View>
              <Text style={styles.label}>Date *</Text>
              <Controller
                control={control}
                name="date"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={inputStyle("date")}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.fieldFlex}>
                <Text style={styles.label}>Start time *</Text>
                <Controller
                  control={control}
                  name="start_time"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={inputStyle("start_time")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("start_time")}
                      onBlur={() => {
                        onBlur()
                        setFocusedField(null)
                      }}
                      placeholder="09:00"
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              <View style={styles.fieldFlex}>
                <Text style={styles.label}>End time *</Text>
                <Controller
                  control={control}
                  name="end_time"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={inputStyle("end_time")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => setFocusedField("end_time")}
                      onBlur={() => {
                        onBlur()
                        setFocusedField(null)
                      }}
                      placeholder="10:00"
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.fieldGroup}>
            <View>
              <Text style={styles.label}>Type *</Text>
              <Controller
                control={control}
                name="type"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={inputStyle("type")}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedField("type")}
                    onBlur={() => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    placeholder="E.g. Check-in"
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>
            <View>
              <Text style={styles.label}>Status *</Text>
              <Controller
                control={control}
                name="status"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.optionRow}>
                    {STATUS_OPTIONS.map(([optValue, label]) => (
                      <TouchableOpacity
                        key={optValue}
                        style={[styles.optionChip, value === optValue && styles.optionChipSelected]}
                        onPress={() => onChange(optValue)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.optionChipText, value === optValue && styles.optionChipTextSelected]}>{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
            <View>
              <Text style={styles.label}>Meeting URL</Text>
              <Controller
                control={control}
                name="meeting_url"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={inputStyle("meeting_url")}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocusedField("meeting_url")}
                    onBlur={() => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    placeholder="https://..."
                    placeholderTextColor="#9ca3af"
                    keyboardType="url"
                    autoCapitalize="none"
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
                    onBlur={() => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    placeholder="Add any notes…"
                    placeholderTextColor="#9ca3af"
                    multiline
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButtonWrapper}
            activeOpacity={0.8}
            onPress={handleSubmit(() => mutate())}
            disabled={isPending || isLoadingClients}
          >
            <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButton}>
              {isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={15} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Add appointment</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AlertModal
        visible={!!errorMessage}
        title="Something went wrong"
        message={errorMessage ?? ""}
        onConfirm={() => setErrorMessage(null)}
      />
    </View>
  )
}

export default AddAppointment

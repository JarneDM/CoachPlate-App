import { useEffect, useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, router } from "expo-router"
import { ArrowLeft, Save } from "lucide-react-native"
import { useForm, Controller } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  useGetAppointmentByIdQueryOptions,
  getAppointmentsQueryOptions,
  getAppointmentByIdQueryOptions,
  editAppointmentMutationOptions,
} from "@/lib/query-options/appointments/appointments"
import { AlertModal } from "@/components/AlertModal"
import { STATUS_LABELS } from "@/utils/appointment"
import type { Appointment } from "@/types/appointment"
import styles from "./index.styles"

type AppointmentForm = {
  date: string
  start_time: string
  end_time: string
  type: string
  status: Appointment["status"]
  notes: string
  meeting_url: string
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [Appointment["status"], string][]

function EditAppointmentPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data: appointment, isLoading } = useGetAppointmentByIdQueryOptions(id)
  const [focusedField, setFocusedField] = useState<keyof AppointmentForm | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AppointmentForm>({
    defaultValues: {
      date: "",
      start_time: "",
      end_time: "",
      type: "",
      status: "open",
      notes: "",
      meeting_url: "",
    },
  })

  useEffect(() => {
    if (appointment) {
      reset({
        date: appointment.date,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes ?? "",
        meeting_url: appointment.meeting_url ?? "",
      })
    }
  }, [appointment, reset])

  const formValues = watch()

  const { mutate, isPending } = useMutation({
    ...editAppointmentMutationOptions(id, formValues),
    onSuccess: () => {
      queryClient.invalidateQueries(getAppointmentsQueryOptions)
      queryClient.invalidateQueries(getAppointmentByIdQueryOptions(id))
      router.back()
    },
    onError: (error: Error) => setErrorMessage(error.message),
  })

  const inputStyle = (field: keyof AppointmentForm) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    errors[field] && styles.inputError,
  ]

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    )
  }

  if (!appointment) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Appointment not found.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Edit appointment</Text>
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
            disabled={isPending}
          >
            <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveButton}>
              {isPending ? (
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
      <AlertModal
        visible={!!errorMessage}
        title="Something went wrong"
        message={errorMessage ?? ""}
        onConfirm={() => setErrorMessage(null)}
      />
    </View>
  )
}

export default EditAppointmentPage

import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, router } from "expo-router"
import { ArrowLeft, Clock, CalendarDays, NotebookPen, Video, Pencil } from "lucide-react-native"
import { useGetAppointmentByIdQueryOptions } from "@/lib/query-options/appointments/appointments"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/appointment"
import { formatDate } from "@/utils/formatDate"
import styles from "./index.styles"

function AppointmentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: appointment, isLoading } = useGetAppointmentByIdQueryOptions(id)

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

  const statusColor = STATUS_COLORS[appointment.status]
  const initial = appointment.client.full_name.charAt(0).toUpperCase()

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <ArrowLeft size={18} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/(coach)/appointments/${id}/edit`)} style={styles.editBtn} activeOpacity={0.7}>
              <Pencil size={16} color="#374151" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial ? initial : "?"}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.clientName} numberOfLines={1}>
                {appointment.client.full_name ? appointment.client.full_name : "No client"}
              </Text>
              <Text style={styles.appointmentType} numberOfLines={1}>
                {appointment.type ? appointment.type : "No type"}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + "1a" }]}>
                <Text style={[styles.statusBadgeText, { color: statusColor }]}>{STATUS_LABELS[appointment.status]}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Schedule</Text>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDate(appointment.date)}</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {appointment.start_time.slice(0, 5)} – {appointment.end_time.slice(0, 5)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <NotebookPen size={14} color="#6b7280" />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          {appointment.notes ? (
            <Text style={styles.notesText}>{appointment.notes}</Text>
          ) : (
            <Text style={styles.emptyText}>No notes added</Text>
          )}
        </View>

        {appointment.meeting_url ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Video size={14} color="#6b7280" />
              <Text style={styles.sectionTitle}>Meeting</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Linking.openURL(appointment.meeting_url)}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionButton}>
                <CalendarDays size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>Join meeting</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}

export default AppointmentDetails

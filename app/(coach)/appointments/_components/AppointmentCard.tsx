import { View, Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";
import type { Appointment } from "@/types/appointment";
import { formatDate } from "@/utils/formatDate";
import styles from "./AppointmentCard.styles";
import { useRouter } from "expo-router"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/appointment";

type Props = {
  appointment: Appointment
}

export default function AppointmentCard({ appointment }: Props) {
  const statusColor = STATUS_COLORS[appointment.status]
  const initial = appointment.client.full_name.charAt(0).toUpperCase()
  const router = useRouter()

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push(`/(coach)/appointments/${appointment.id}`)}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial ? initial : "?"}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {appointment.client.full_name ? appointment.client.full_name : "No client"}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "1a" }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>{STATUS_LABELS[appointment.status]}</Text>
            </View>
          </View>
          <Text style={styles.type} numberOfLines={1}>
            {appointment.type ? appointment.type : "No type"}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#9ca3af" />
              <Text style={styles.metaText}>
                {formatDate(appointment.date)} · {appointment.start_time.slice(0, 5)}–{appointment.end_time.slice(0, 5)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

import { View, Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";
import type { Appointment } from "@/types/appointment";
import { formatDate } from "@/utils/formatDate";
import styles from "./AppointmentCard.styles";

const STATUS_COLORS: Record<Appointment["status"], string> = {
  open: "#16a34a",
  scheduled: "#2563eb",
  completed: "#6b7280",
  canceled: "#ef4444",
  no_show: "#f59e0b",
};

const STATUS_LABELS: Record<Appointment["status"], string> = {
  open: "Open",
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
  no_show: "No show",
};

type Props = {
  appointment: Appointment;
  onPress?: () => void;
};

export default function AppointmentCard({ appointment, onPress }: Props) {
  const statusColor = STATUS_COLORS[appointment.status];
  const initial = appointment.client.full_name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress} disabled={!onPress}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {appointment.client.full_name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "1a" }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                {STATUS_LABELS[appointment.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.type} numberOfLines={1}>
            {appointment.type}
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
  );
}

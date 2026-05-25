import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CalendarRange } from "lucide-react-native";

type Appointment = {
  id: string;
  status: string;
  availability_slots: {
    date: string;
    start_time: string;
    end_time: string;
    type: string | null;
  };
};

type AppointmentsCardProps = {
  appointments: Appointment[];
};

export function AppointmentsCard({ appointments }: AppointmentsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <CalendarRange size={17} color="#16a34a" />
          <Text style={styles.cardTitle}>Appointments</Text>
        </View>
        <Text style={styles.countText}>
          {appointments.length} {appointments.length !== 1 ? "appointments" : "appointment"}
        </Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyState}>
          <CalendarRange size={40} color="#d1d5db" />
          <Text style={styles.emptyText}>No appointments booked yet.</Text>
        </View>
      ) : (
        <View>
          {appointments.map((appointment, index) => (
            <View
              key={appointment.id}
              style={[styles.appointmentRow, index === appointments.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={styles.itemName}>{appointment.availability_slots?.type ?? "Appointment"}</Text>
              <Text style={styles.itemDate}>
                {appointment.availability_slots?.date} · {appointment.availability_slots?.start_time?.slice(0, 5)} –{" "}
                {appointment.availability_slots?.end_time?.slice(0, 5)}
              </Text>
              <Text style={styles.statusBadge}>{appointment.status}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  countText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  appointmentRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  itemDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 11,
    color: "#16a34a",
    fontWeight: "500",
    marginTop: 4,
    textTransform: "capitalize",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
});

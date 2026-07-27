import { useGetAppointmentsQueryOptions } from "@/lib/query-options/appointments/appointments";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { CalendarClock } from "lucide-react-native";
import type { Appointment } from "@/types/appointment";
import AppointmentCard from "./_components/AppointmentCard";
import styles from "./index.styles";
import { useRouter } from "expo-router"

function Appointments() {
  const appointments = useGetAppointmentsQueryOptions();
  const router = useRouter()
  const count = appointments.data?.length ?? 0;

  const renderItem = ({ item }: { item: Appointment }) => <AppointmentCard appointment={item} />

  if (appointments.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.header}>
          <Text style={styles.title}>Appointments</Text>
          <Text style={styles.subtitle}>
            {count} {count === 1 ? "appointment" : "appointments"}
          </Text>
        </View>
      </View>

      {appointments.isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{appointments.error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={appointments.data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <CalendarClock size={28} color="#16a34a" />
              </View>
              <Text style={styles.emptyTitle}>No appointments yet</Text>
              <Text style={styles.emptySubtitle}>Booked appointments will show up here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default Appointments;

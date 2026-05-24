import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase/supabase";
import { CalendarDays, Dumbbell, CalendarRange, Hand } from "lucide-react-native";
import { StatCard } from "@/components/client/StatCard";
import { PlanCard } from "@/components/client/PlanCard";
import { AppointmentsCard } from "@/components/client/AppointmentsCard";
type Client = { id: string; coach_id: string | null; full_name: string | null; email: string | null };
type Plan = { id: string; name: string; created_at: string };
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

export default function ClientDashboard() {
  const [client, setClient] = useState<Client | null>(null);
  const [mealPlans, setMealPlans] = useState<Plan[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<Plan[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: clientData } = await supabase.from("clients").select("id, coach_id, full_name, email").eq("user_id", user.id).single();

      if (!clientData) return;
      setClient(clientData);

      const [mealPlansResult, trainingPlansResult, appointmentsResult] = await Promise.all([
        supabase
          .from("meal_plans")
          .select("id, name, created_at")
          .eq("client_id", clientData.id)
          .eq("coach_id", clientData.coach_id)
          .order("created_at", { ascending: false }),
        supabase
          .from("training_plans")
          .select("id, name, created_at")
          .eq("client_id", clientData.id)
          .eq("coach_id", clientData.coach_id)
          .order("created_at", { ascending: false }),
        supabase
          .from("appointments")
          .select("id, status, availability_slots(date, start_time, end_time, type)")
          .eq("client_id", clientData.id)
          .eq("coach_id", clientData.coach_id)
          .order("created_at", { ascending: false }),
      ]);

      setMealPlans(mealPlansResult.data ?? []);
      setTrainingPlans(trainingPlansResult.data ?? []);
      setAppointments((appointmentsResult.data as any) ?? []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  const firstName = client?.full_name?.split(" ")[0];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.welcomeText}>Welcome, {firstName}!</Text>
          </View>
          <Text style={styles.subheader}>Here you can find all your plans from your coach.</Text>
          <TouchableOpacity style={styles.appointmentButton} activeOpacity={0.8}>
            <CalendarRange size={15} color="#ffffff" />
            <Text style={styles.appointmentButtonText}>Schedule appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Meal plans" value={mealPlans.length} icon={<CalendarDays size={18} color="#15803d" />} />
          <StatCard label="Training plans" value={trainingPlans.length} icon={<Dumbbell size={18} color="#15803d" />} />
          <StatCard label="Appointments" value={appointments.length} icon={<CalendarRange size={18} color="#15803d" />} />
        </View>

        <PlanCard
          title="Meal plans"
          icon={<CalendarDays size={17} color="#16a34a" />}
          plans={mealPlans}
          emptyText="No meal plans received from your coach yet."
          emptyIcon={<CalendarDays size={40} color="#d1d5db" />}
          routePrefix="/(client)/meal-plans"
        />

        <PlanCard
          title="Training plans"
          icon={<Dumbbell size={17} color="#16a34a" />}
          plans={trainingPlans}
          emptyText="No training plans received from your coach yet."
          emptyIcon={<Dumbbell size={40} color="#d1d5db" />}
        />

        <AppointmentsCard appointments={appointments} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scroll: {
    padding: 20,
    gap: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subheader: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  appointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  appointmentButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
});

import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase/supabase";
import { router } from "expo-router";
import { Hand, Users, CalendarDays, NotepadText, Sparkles } from "lucide-react-native";

type Coach = { id: string; full_name: string; email: string };
type Client = { id: string; full_name: string; goal: string | null };

export default function DashboardCoach() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [clientCount, setClientCount] = useState(0);
  const [mealPlanCount, setMealPlanCount] = useState(0);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [coachResult, clientCountResult, mealPlanCountResult, recentClientsResult] = await Promise.all([
        supabase.from("coaches").select("*").eq("id", user.id).single(),
        supabase.from("clients").select("*", { count: "exact", head: true }).eq("coach_id", user.id),
        supabase.from("meal_plans").select("*", { count: "exact", head: true }).eq("coach_id", user.id),
        supabase.from("clients").select("id, full_name, goal").eq("coach_id", user.id).order("created_at", { ascending: false }).limit(3),
      ]);

      setCoach(coachResult.data);
      setClientCount(clientCountResult.count ?? 0);
      setMealPlanCount(mealPlanCountResult.count ?? 0);
      setRecentClients(recentClientsResult.data ?? []);
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.welcomeText}>Welcome back, {coach?.full_name?.split(" ")[0]}!</Text>
          </View>
          <Text style={styles.subheader}>Here is an overview of your CoachPlate activity.</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Active clients" value={clientCount} icon={<Users size={18} color="#15803d" />} />
          <StatCard label="Meal plans" value={mealPlanCount} icon={<CalendarDays size={18} color="#15803d" />} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent clients</Text>
            <TouchableOpacity onPress={() => router.push("/(coach)/clients" as any)}>
              <Text style={styles.linkText}>All clients →</Text>
            </TouchableOpacity>
          </View>

          {recentClients.length > 0 ? (
            <View>
              {recentClients.map((client, index) => (
                <View key={client.id} style={[styles.clientRow, index === recentClients.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.clientLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{client.full_name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.clientName}>{client.full_name}</Text>
                      <Text style={styles.clientGoal}>{client.goal ?? "No goal set"}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>View →</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add a client</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Users size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>You have not added any clients yet.</Text>
              <TouchableOpacity style={styles.addNewButton}>
                <Text style={styles.addButtonText}>Add first client</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.actionsGrid}>
          <QuickActionCard icon={<Users size={18} color="#15803d" />} title="New client" description="Add a client" />
          <QuickActionCard icon={<CalendarDays size={18} color="#15803d" />} title="New meal plan" description="Create a meal plan" />
          <QuickActionCard icon={<NotepadText size={18} color="#15803d" />} title="New recipe" description="Add a recipe" />
          <QuickActionCard icon={<Sparkles size={18} color="#15803d" />} title="AI meal plan" description="Generate with AI" />
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickActionCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.7}>
      <View style={styles.quickActionIcon}>{icon}</View>
      <View>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
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
    marginBottom: 20,
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  statIcon: {
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    padding: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
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
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  linkText: {
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "500",
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  clientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
  },
  clientName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  clientGoal: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: "center",
  },
  addNewButton: {
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 14,
    width: "47.5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    height: 80,
  },
  quickActionIcon: {
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    padding: 8,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  quickActionDesc: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 1,
  },
});

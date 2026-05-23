import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase/supabase";
import { CalendarDays, User, Clock, ArrowRight, Plus } from "lucide-react-native";

type MealPlan = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  clients: { full_name: string } | null;
};

export default function MealPlansScreen() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // TODO(cleanup): make custom hook
  const fetchPlans = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("meal_plans")
      .select("id, name, start_date, end_date, is_active, clients(full_name)")
      .eq("coach_id", user.id)
      .order("created_at", { ascending: false });

    setPlans(
      (data ?? []).map((plan) => ({
        ...plan,
        clients: Array.isArray(plan.clients) ? (plan.clients[0] ?? null) : plan.clients,
      })) as MealPlan[],
    );
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  // TODO(cleanup): move to utils or helpers
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16a34a" />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meal Plans</Text>
          <Text style={styles.subtitle}>
            {plans.length} {plans.length === 1 ? "plan" : "plans"} created
          </Text>
        </View>
      </View>

      {plans.length > 0 ? (
        <View style={styles.list}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.card}
              onPress={() => router.push(`/(coach)/meal-plans/${plan.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconWrap}>
                  <CalendarDays size={20} color="#16a34a" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.planName} numberOfLines={1}>
                    {plan.name}
                  </Text>
                  <View style={styles.metaRow}>
                    {plan.clients?.full_name && (
                      <View style={styles.metaItem}>
                        <User size={11} color="#9ca3af" />
                        <Text style={styles.metaText}>{plan.clients.full_name}</Text>
                      </View>
                    )}
                    {plan.start_date && (
                      <View style={styles.metaItem}>
                        <Clock size={11} color="#9ca3af" />
                        <Text style={styles.metaText}>
                          {formatDate(plan.start_date)}
                          {plan.end_date ? ` → ${formatDate(plan.end_date)}` : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, plan.is_active ? styles.badgeActive : styles.badgeInactive]}>
                      <Text style={[styles.badgeText, plan.is_active ? styles.badgeTextActive : styles.badgeTextInactive]}>
                        {plan.is_active ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <ArrowRight size={16} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <CalendarDays size={28} color="#16a34a" />
          </View>
          <Text style={styles.emptyTitle}>No meal plans yet</Text>
          <Text style={styles.emptyDesc}>Create your first meal plan for a client.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
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
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 2,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 44,
    height: 44,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: "#f0fdf4",
  },
  badgeInactive: {
    backgroundColor: "#f3f4f6",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  badgeTextActive: {
    color: "#15803d",
  },
  badgeTextInactive: {
    color: "#6b7280",
  },
  empty: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  emptyDesc: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
});

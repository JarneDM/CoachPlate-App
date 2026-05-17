import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";

type Plan = {
  id: string;
  name: string;
  created_at: string;
};

type PlanCardProps = {
  title: string;
  icon: React.ReactNode;
  plans: Plan[];
  emptyText: string;
  emptyIcon: React.ReactNode;
};

export function PlanCard({ title, icon, plans, emptyText, emptyIcon }: PlanCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          {icon}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.countText}>
          {plans.length} {plans.length !== 1 ? "plans" : "plan"}
        </Text>
      </View>

      {plans.length === 0 ? (
        <View style={styles.emptyState}>
          {emptyIcon}
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        // TODO: link to plan details page
        <View>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planRow, index === plans.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.itemName}>{plan.name}</Text>
                <Text style={styles.itemDate}>
                  {new Date(plan.created_at).toLocaleDateString("nl-BE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <ArrowRight size={16} color="#d1d5db" />
            </TouchableOpacity>
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
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

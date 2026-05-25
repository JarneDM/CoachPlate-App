import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  dayRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  dayName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  dayRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  dayKcal: { fontSize: 12, fontWeight: "600", color: "#f97316" },
  dayProtein: { fontSize: 12, color: "#9ca3af" },

  mealsContainer: {
    backgroundColor: "#fafafa",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  mealsContainerBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  mealRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    gap: 10,
  },
  mealRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  mealDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  mealInfo: { flex: 1, minWidth: 0 },
  mealHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mealType: { fontSize: 11, fontWeight: "600" },
  mealKcal: { fontSize: 11, color: "#9ca3af" },
  mealName: { fontSize: 13, fontWeight: "500", color: "#111827", marginTop: 1 },
  mealMacros: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
});

export default styles;

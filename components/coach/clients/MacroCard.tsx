import { View, Text, StyleSheet } from "react-native";

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  orange: { bg: "#fff7ed", text: "#f97316" },
  blue:   { bg: "#eff6ff", text: "#3b82f6" },
  yellow: { bg: "#fefce8", text: "#ca8a04" },
  red:    { bg: "#fef2f2", text: "#ef4444" },
};

type MacroCardProps = {
  label: string;
  value: number | null;
  unit: string;
  color: "orange" | "blue" | "yellow" | "red";
};

function MacroCard({ label, value, unit, color }: MacroCardProps) {
  const { bg, text } = COLOR_MAP[color];

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={[styles.value, { color: text }]}>{value ?? "—"}</Text>
      <Text style={[styles.unit, { color: text }]}>{value !== null ? unit : ""}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
  },
  unit: {
    fontSize: 11,
    fontWeight: "500",
  },
  label: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
});

export default MacroCard;

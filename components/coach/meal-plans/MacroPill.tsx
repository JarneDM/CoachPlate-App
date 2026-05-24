import { StyleSheet, Text, View } from "react-native";

export function MacroPill({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <View style={styles.macroPill}>
      <Text style={[styles.macroPillValue, { color }]}>
        {value}
        {unit}
      </Text>
      <Text style={styles.macroPillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  macroPill: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  macroPillValue: { fontSize: 14, fontWeight: "700" },
  macroPillLabel: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
});

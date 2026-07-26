import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Href, router } from "expo-router"

export default function QuickActionCard({
  icon,
  title,
  description,
  path,
}: {
  icon: React.ReactNode
  title: string
  description: string
  path: Href
}) {
  return (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={() => router.push(path)}>
      <View style={styles.quickActionIcon}>{icon}</View>
      <View>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },
});
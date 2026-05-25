import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, PenLine, Sparkles } from "lucide-react-native";

export default function AddMealPlan() {
  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={18} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>New weekly menu</Text>
          <Text style={styles.subtitle}>Choose how you want to create your weekly menu.</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          <TouchableOpacity
            onPress={() => router.push("/(coach)/meal-plans/new/ai")}
            style={styles.card}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, styles.iconWrapGreen]}>
              <Sparkles size={24} color="#16a34a" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Generate with AI</Text>
              <Text style={styles.cardDesc}>Describe what you want and AI will create the menu.</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Recommended</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(coach)/meal-plans/new/manual")}
            style={styles.card}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, styles.iconWrapGray]}>
              <PenLine size={24} color="#6b7280" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Create Manually</Text>
              <Text style={styles.cardDesc}>Build your weekly menu manually, day by day.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  backBtn: { padding: 4 },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapGreen: {
    backgroundColor: "#f0fdf4",
  },
  iconWrapGray: {
    backgroundColor: "#f9fafb",
  },
  cardText: {
    alignItems: "center",
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 16,
  },
  badge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#15803d",
  },
});

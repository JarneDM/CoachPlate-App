import { router } from "expo-router";
import { useFonts } from "expo-font";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock8, BarChart2, Users } from "lucide-react-native";

const FEATURES = [
  { icon: <Clock8 size={18} color="#16a34a" />, label: "Build plans in minutes, not hours" },
  { icon: <BarChart2 size={18} color="#16a34a" />, label: "Track client progress at a glance" },
  { icon: <Users size={18} color="#16a34a" />, label: "Connect coaches and clients instantly" },
];

export default function Index() {
  const [fontsLoaded] = useFonts({
    Geist: require("assets/fonts/Geist-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.capsule}>
            <Text style={styles.capsuleText}>CoachPlate</Text>
          </View>
          <Text style={styles.title}>Coach smarter.{"\n"}Train better.</Text>
          <Text style={styles.subtitle}>
            The platform built for coaches and their clients. Nutrition, training, and progress in one place.
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              {f.icon}
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(auth)/register")} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Get started for free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(auth)/login")} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: 28,
    gap: 36,
  },
  hero: {
    alignItems: "center",
    gap: 12,
  },
  capsule: {
    backgroundColor: "#F0FDF5",
    borderColor: "#CAFADA",
    borderWidth: 2,
    borderRadius: 9999,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  capsuleText: {
    color: "#388357",
    fontWeight: "bold",
    fontSize: 13,
  },
  title: {
    fontFamily: "Geist",
    fontSize: 36,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  features: {
    width: "100%",
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#86efac",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
});

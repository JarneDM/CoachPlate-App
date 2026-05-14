import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { supabase } from "@/lib/supabase/supabase";
import { router } from "expo-router";

export default function SettingsScreen() {
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    overflow: "hidden",
  },
  logoutButton: {
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#dc2626",
  },
});

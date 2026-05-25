import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import ClientNavMenu from "@/components/ClientNavMenu";

export default function ClientLayout() {
  return (
    <View style={styles.container}>
      <ClientNavMenu />
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
  },
});

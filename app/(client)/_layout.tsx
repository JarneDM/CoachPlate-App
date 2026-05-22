import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavMenu from "components/NavMenu";

export default function ClientLayout() {
  return (
    <View style={styles.container}>
      // TODO: make nav menu for client with different options than coach
      <NavMenu />
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

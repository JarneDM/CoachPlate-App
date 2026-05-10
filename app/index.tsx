import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import NavButton from "./components/NavButton";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.cta}>
        <NavButton content="Login" onPress={() => router.push("/(auth)/login")} />
        <Text>or</Text>
        <NavButton content="Sign Up" onPress={() => router.push("/(auth)/register")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});

import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen({ message = "Not found." }: { message?: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 14, color: "#9ca3af" },
});

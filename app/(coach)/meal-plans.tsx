import { View, Text, StyleSheet } from "react-native";

export default function MealPlansScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Plans</Text>
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
  },
});

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import Loginform from "components/auth/Loginform";

export default function Login() {
  return (
    <View style={styles.container}>
      <Loginform />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});

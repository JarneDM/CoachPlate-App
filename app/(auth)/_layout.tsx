import { Slot } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { UserTypeContext } from "@/context/UserTypeContext";

function AuthLayout() {
  const [fontsLoaded] = useFonts({
    Geist: require("assets/fonts/Geist-VariableFont_wght.ttf"),
  });

  const [userType, setUserType] = useState<"coach" | "client">("coach");

  const isWeb = Platform.OS === "web";

  if (!fontsLoaded) return null;
  return (
    <UserTypeContext.Provider value={[userType, setUserType]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.capsule}>
            <Text style={styles.capsuleText}>CoachPlate</Text>
          </View>
          {userType === "coach" ? (
            <View style={isWeb ? { marginBottom: 10 } : { marginBottom: -20 }}>
              <Text style={styles.header}>Work smarter as a coach</Text>
              <Text style={styles.subheader}>Plan nutrition and training in minutes, not hours.</Text>
            </View>
          ) : (
            <View style={isWeb ? { marginBottom: 10 } : { marginBottom: -20 }}>
              <Text style={styles.header}>Make progress every day</Text>
              <Text style={styles.subheader}>Follow a personalized plan built just for you.</Text>
            </View>
          )}
        </View>
        <View style={styles.formContainer}>
          <Slot />
        </View>
      </SafeAreaView>
    </UserTypeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  hero: {
    alignItems: "center",
  },
  capsule: {
    backgroundColor: "#F0FDF5",
    borderColor: "#CAFADA",
    borderWidth: 2,
    borderRadius: 9999,
    padding: 2,
    width: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  capsuleText: {
    color: "#388357",
    fontWeight: "bold",
  },
  header: {
    fontFamily: "Geist",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subheader: {
    fontFamily: "Geist",
    fontSize: 14,
    color: "#6b806f",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 420,
  },
});

export default AuthLayout;

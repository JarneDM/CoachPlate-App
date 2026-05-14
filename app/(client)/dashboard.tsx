import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text } from "react-native";
import { supabase } from "@/lib/supabase/supabase";
import { router } from "expo-router";

function dashboard() {
  return (
    <SafeAreaView>
      <Text>Client Dashboard</Text>
      <Button
        title="Logout"
        onPress={() => {
          supabase.auth
            .signOut()
            .then(() => {
              router.push("/(auth)/login");
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        }}
      />
    </SafeAreaView>
  );
}

export default dashboard

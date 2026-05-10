import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Loginform from "components/auth/Loginform";

export default function Login() {
  return (
    <SafeAreaView>
      <Loginform />
    </SafeAreaView>
  );
}

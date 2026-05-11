import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterForm } from "components/auth/RegisterForm";

function register() {
  return (
    <SafeAreaView>
      <RegisterForm />
    </SafeAreaView>
  );
}

export default register;

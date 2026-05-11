import { useState, useContext } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import Input from "../Input";
import { UserTypeContext } from "@/context/UserTypeContext";
import { Controller, set, useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/supabase";

interface RegisterProps {
  fullName: string;
  email: string;
  password: string;
  coachCode?: string;
}

export const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      coachCode: "",
    },
  });
  const [userType, setUserType] = useContext(UserTypeContext);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDisabled = !acceptedTerms;

const onSubmit = async (data: RegisterProps) => {
  setLoading(true);
  const email = data.email.toLowerCase();
  const { error: authError } = await supabase.auth.signUp({
    email: email,
    password: data.password,
    options: {
      emailRedirectTo: `https://www.coachplate.com/auth/callback`,
      data: {
        full_name: data.fullName,
        terms_accepted: true,
        terms_accepted_at: acceptedTerms ? new Date().toISOString() : null,
        terms_version: "2026-03-29",
        role: userType,
      },
    },
  });
  if (authError) {
    console.error("Error signing up:", authError);
    setError(authError.message);
    setLoading(false);
    return;
  }
  userType === "coach" ? router.push("/(coach)/dashboard") : router.push("/(client)/dashboard");
  setLoading(false);
};

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, userType === "coach" && styles.optionButtonSelected]}
          onPress={() => setUserType("coach")}
        >
          <Text style={styles.optionText}>Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, userType === "client" && styles.optionButtonSelected]}
          onPress={() => setUserType("client")}
        >
          <Text style={styles.optionText}>Client</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.fields}>
        <View>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Full name</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field: { onChange, value } }) => <Input value={value} onChangeText={onChange} placeholder="Jan Janssen" />}
          />
        </View>

        <View>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Email address</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field: { onChange, value } }) => (
              <Input value={value} onChangeText={onChange} placeholder="your@email.com" type="email" />
            )}
          />
        </View>

        <View>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } }}
            render={({ field: { onChange, value } }) => (
              <Input value={value} onChangeText={onChange} placeholder="At least 8 characters" type="password" />
            )}
          />
          <Text style={styles.hint}>At least 8 characters</Text>
        </View>

        {userType === "client" && (
          <View>
            <Text style={styles.label}>Coach Code</Text>
            <Controller
              control={control}
              name="coachCode"
              render={({ field: { onChange, value } }) => (
                <Input value={value} onChangeText={onChange} placeholder="Enter your coach's code" />
              )}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.checkboxRow, acceptedTerms && styles.checkboxRowChecked]}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>terms and conditions</Text> and the{" "}
            <Text style={styles.termsLink}>privacy policy</Text>.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{loading ? "Creating account..." : "Create account"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.bottomLink}>
          Log in
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  required: {
    top: -5,
    color: "#ef4444",
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomColor: "#16a34a",
  },
  optionButtonSelected: {
    borderBottomWidth: 3,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorBannerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#b91c1c",
  },
  fields: {
    gap: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    padding: 12,
  },
  checkboxRowChecked: {
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  termsLink: {
    color: "#0f172a",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#86efac",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#86efac",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  bottomText: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748b",
  },
  bottomLink: {
    fontWeight: "600",
    color: "#15803d",
  },
});

import { useState, useContext } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import Input from "../Input";
import { UserTypeContext } from "@/context/UserTypeContext";

export const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coachCode, setCoachCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useContext(UserTypeContext);

  const isDisabled = loading || !fullName.trim() || !email.trim() || !password || !acceptedTerms;

  function handleRegister() {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions to register");
      return;
    }

    setLoading(true);
    console.log({ fullName, email, password, acceptedTerms, userType });
    setLoading(false);
  }

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
          <Input value={fullName} onChangeText={setFullName} placeholder="Jan Janssen" />
        </View>

        <View>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Email address</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Input value={email} onChangeText={setEmail} placeholder="your@email.com" type="email" />
        </View>

        <View>
          <View style={styles.labelBox}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Input value={password} onChangeText={setPassword} placeholder="At least 8 characters" type="password" />
          <Text style={styles.hint}>At least 8 characters</Text>
        </View>

        {userType === "client" && (
          <View>
            <Text style={styles.label}>Coach Code</Text>
            <Input value={coachCode} onChangeText={setCoachCode} placeholder="Enter your coach's code" />
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
          onPress={handleRegister}
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

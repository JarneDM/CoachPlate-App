import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import Input from "../Input";
import { loginMutationOptions } from "@/lib/query-options/auth/login";

type LoginProps = {
  email: string;
  password: string;
};

function Loginform() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    ...loginMutationOptions,
    onSuccess: (data) => {
      router.push(data.user.role === "coach" ? "/(coach)/dashboard" : "/(client)/dashboard");
    },
    onError: (error: Error) => setError(error.message),
  });

  const onSubmit = (data: LoginProps) => {
    setError(null);
    mutation.mutate({ email: data.email.toLowerCase(), password: data.password });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to manage your dashboard and clients.</Text>
      </View>

      <View style={styles.fields}>
        <View>
          <Text style={styles.label}>Email address</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field: { onChange, value } }) => (
              <Input value={value.toLowerCase()} onChangeText={onChange} placeholder="your@email.com" type="email" />
            )}
          />
          {errors.email && <Text style={styles.fieldError}>{errors.email.message}</Text>}
        </View>

        <View>
          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
          </View>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field: { onChange, value } }) => (
              <Input value={value} onChangeText={onChange} placeholder="••••••••" type="password" />
            )}
          />
          {errors.password && <Text style={styles.fieldError}>{errors.password.message}</Text>}
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, mutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{mutation.isPending ? "Logging in..." : "Log in"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>
        No account yet?{" "}
        <Link href="/register" style={styles.bottomLink}>
          Register for free
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
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
  fieldError: {
    marginTop: 4,
    fontSize: 12,
    color: "#b91c1c",
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  errorBanner: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  errorBannerText: {
    color: "#b91c1c",
    fontSize: 13,
    textAlign: "center",
  },
});

export default Loginform;

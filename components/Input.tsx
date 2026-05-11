import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: string;
};

const Input = ({ value, onChangeText, placeholder, type }: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const isPassword = type === "password";
  const isEmail = type === "email";
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          {
            borderColor: isFocused ? "#22c55e" : "#e2e8f0",
            shadowColor: isFocused ? "#22c55e" : "#000",
            shadowOpacity: isFocused ? 0.2 : 0.05,
          },
          Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {},
        ]}
        secureTextEntry={isPassword}
        inputMode={isEmail ? "email" : "text"}
        placeholderTextColor="gray"
        underlineColorAndroid="transparent"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default Input;

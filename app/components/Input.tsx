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
            borderColor: isFocused ? "green" : "gray",
          },
          Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {},
        ]}
        textContentType={isPassword ? "password" : isEmail ? "emailAddress" : "none"}
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
    height: 40,
    borderWidth: 2,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 200,
    marginTop: 20,
  },
});

export default Input;

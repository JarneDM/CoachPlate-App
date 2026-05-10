import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";

const Input = ({ value, onChangeText, placeholder }: { value: string; onChangeText: (text: string) => void; placeholder: string }) => {
  const [isFocused, setIsFocused] = React.useState(false);
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

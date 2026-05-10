import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// TODO(auth): add onPress functionality to add functionality to the buttons

const NavButton = ({ content }: { content: string }) => {
  return (
    <View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{content}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FAF9F6",
    fontWeight: "bold",
  },
});

export default NavButton;

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";

const Header = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {navigation.canGoBack() && (
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text
        style={{
          color: "black",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backArrow: {
    position: "absolute",
    left: 10,
  },
});

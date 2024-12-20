import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

const Searchbar = () => {
  return (
    <View style={styles.searchbarContainer}>
      <Image
        source={"https://img.icons8.com/metro/26/search.png"}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search"
        style={styles.textInput}
        placeholderTextColor="#a9a9a9"
      />
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({
  searchbarContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#fff",
    position: "relative",
    elevation: 25,
    paddingHorizontal: 10,
  },
  searchIcon: {
    height: 20,
    width: 20,
    transform: [{ rotate: "270deg" }, { scaleX: -1 }],
  },
  textInput: {
    flex: 1,
    padding: 10,
    color: "black",
    fontSize: 14,
  },
});

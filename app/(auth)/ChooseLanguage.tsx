import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";

const languages = [
  { id: "1", name: "English", flag: "🇬🇧" },
  { id: "2", name: "Italian", flag: "🇮🇹" },
  { id: "3", name: "Chinese", flag: "🇨🇳" },
  { id: "4", name: "French", flag: "🇫🇷" },
  { id: "5", name: "German", flag: "🇩🇪" },
  { id: "6", name: "Spanish", flag: "🇪🇸" },
  { id: "7", name: "Russian", flag: "🇷🇺" },
];

const ChooseLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleContinue = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose the language</Text>
      <Text style={styles.subtitle}>
        Don’t worry! It happens. Please enter the email associated with your
        account.
      </Text>
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
      <FlatList
        data={languages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.languageItem,
              selectedLanguage === item.name && styles.selectedItem,
            ]}
            onPress={() => setSelectedLanguage(item.name)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.languageName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
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
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedItem: {
    backgroundColor: "#f0f8ff",
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  languageName: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ChooseLanguage;

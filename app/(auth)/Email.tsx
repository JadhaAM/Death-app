import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";

const Email = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { baseURL } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailCheckAndSendCode = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${baseURL}/api/user/send-emailcode`, {
        email: email,
      });
      Alert.alert("Success", "otp sent by email");
      console.log("Success", "otp sent by email");

      router.push("/(auth)/VerifyOTP");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password?</Text>
      <Text style={styles.subtitle}>
        Don't worry! It happens. Please enter the email associated with your
        account.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailCheckAndSendCode}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Send code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 30 },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2962FF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default Email;

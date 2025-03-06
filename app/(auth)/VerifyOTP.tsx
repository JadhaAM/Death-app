import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerifyOTP = () => {
  const router = useRouter();
  const { authUser, setToken, userId, baseURL, isVerified, setVerified } =
    useContext(AuthContext);
  const { Email } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(20);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const confirmationCode = code.join("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      // const userId = await AsyncStorage.setItem('UserId');;
      console.log(userId);

      let userID = userId;

      const response = await axios.post(
        `${baseURL}/api/user/confirm/${userID}`,
        {
          confirmationCode: confirmationCode,
        },
      );
      console.log(response.data.message);

      if (response.status === 200) {
        if (isVerified) {
          router.push("/(auth)/PasswordReset");
        } else {
          setVerified(true);
          router.push("/(auth)/SignIn");
        }
      } else {
      }
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];

    if (value.length > 1) {
      newCode[index] = value.slice(-1);
    } else {
      newCode[index] = value;
    }

    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event: unknown, index: number) => {
    if (index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    let countdown: NodeJS.Timeout | undefined;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);
  const email = authUser?.email ?? Email;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please check your email </Text>
      <Text style={styles.subtitle}>
        We've sent a code to your email. {email} Please enter the code below:
      </Text>
      <View style={styles.codeInputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            placeholder=""
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(value) => handleCodeChange(value, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.timer}>
        {timer > 0
          ? `Resend code in ${timer}s`
          : "Code expired. Please request a new one."}
      </Text>
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
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    width: "15%",
  },
  button: {
    backgroundColor: "#2962FF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  timer: { textAlign: "center", color: "#FF3D00", fontSize: 14, marginTop: 10 },
});

export default VerifyOTP;

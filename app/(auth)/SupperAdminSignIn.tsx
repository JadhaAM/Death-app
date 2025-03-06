import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  GestureResponderEvent,
  Linking,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext/AuthContext";
import { useContext, useState } from "react";
import React from "react";
import { jwtDecode } from "jwt-decode";

const SupperAdminSignIn = () => {
  const router = useRouter();
  const { token, admin, setAdmin, setToken, baseURL } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleSwitch = () => setIsChecked((previousState) => !previousState);
  console.log(baseURL);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: { email: any; password: any }) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseURL}/api/admin/login`, {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        console.log("admin data :", response.user);

        const adminToken = response.data.token;
        const decodedToken = jwtDecode(adminToken);
        console.log("Decoded Token:", decodedToken);
        setAdmin(response.data.user);
        console.log("admin token :", admin);

        router.push("/(auth)/MainAdminOptions");
      } else if (response.status === 400) {
        Alert.alert("Error", response.data.message || "An error occurred.");
      } else {
        Alert.alert("Error", "Failed to log in. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during log in.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Hi, Welcome! <Text style={styles.wave}>👋</Text>
        </Text>
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email"
              placeholderTextColor="#A1A1A1"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Password"
                placeholderTextColor="#A1A1A1"
                secureTextEntry={!passwordVisible}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Entypo
                  name={passwordVisible ? "eye-with-line" : "eye"}
                  size={20}
                  color="#A1A1A1"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Remember Me & Forgot Password 
                        <View style={styles.optionsContainer}>
                            <View style={styles.rememberMeContainer}>
                                <Switch
                                    value={isChecked}
                                    onValueChange={toggleSwitch}
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={isChecked ? '#f5dd4b' : '#f4f3f4'}
                                />
                                <Text style={styles.rememberText}>Remember me</Text>
                            </View>
                            <TouchableOpacity onPress={() => router.push("/(auth)/Email")}>
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View> */}

            {/* Log In Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={
                handleSubmit as unknown as (
                  event: GestureResponderEvent,
                ) => void
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}> Super Admin Log in</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Or with */}
      {/* <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>Or with</Text>
                <View style={styles.divider} />
            </View> */}

      {/* Social Login Buttons */}
      <View style={styles.socialContainer}>
        {/* <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="facebook" size={20} color="#4267B2" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity> */}
        {/* <TouchableOpacity
                    style={styles.socialButton}
                    onPress={handleGoogleLogin as unknown as (event: GestureResponderEvent) => void}
                >
                    <FontAwesome name="google" size={20} color="#DB4437" />
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (<Text style={styles.socialButtonText}>Google</Text>
                    )}
                </TouchableOpacity> */}
      </View>

      {/* Login with Phone */}
      {/* <TouchableOpacity style={styles.phoneButton} onPress={() => router.push('/(auth)/LoginWithPhone')}>
                <Text style={styles.phoneButtonText}>Login with Phone</Text>
            </TouchableOpacity> */}

      {/* Sign Up */}
      {/* <Text style={styles.footerText}>
                Don’t have an account?{' '}
                <Text
                    style={styles.signupText}
                    onPress={() => router.push('/(auth)/SignUp')}
                >
                    Sign up
                </Text>
            </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: { marginBottom: 20 },
  welcomeText: { fontSize: 24, fontWeight: "bold", color: "#000" },
  wave: { fontSize: 24 },
  label: { fontSize: 14, fontWeight: "500", color: "#000", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    color: "#000",
  },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    marginBottom: 10,
  },
  inputPassword: { flex: 1, padding: 12, color: "#000" },
  eyeIcon: { paddingHorizontal: 10 },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rememberMeContainer: { flexDirection: "row", alignItems: "center" },
  rememberText: { fontSize: 14, color: "#000" },
  forgotText: { fontSize: 14, color: "#3366FF" },
  loginButton: {
    backgroundColor: "#3366FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#E6E6E6" },
  orText: { marginHorizontal: 10, fontSize: 14, color: "#7A7A7A" },
  socialContainer: { flexDirection: "row", justifyContent: "space-between" },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#000",
    alignItems: "center",
    alignContent: "center",
  },
  phoneButton: { padding: 12, borderRadius: 8, alignItems: "center" },
  phoneButtonText: { fontSize: 14, fontWeight: "500", color: "#000" },
  footerText: { textAlign: "center", fontSize: 14, color: "#7A7A7A" },
  signupText: { color: "#3366FF", fontWeight: "bold" },
});

export default SupperAdminSignIn;

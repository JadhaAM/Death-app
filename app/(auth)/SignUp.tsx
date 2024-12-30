import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert, ActivityIndicator, GestureResponderEvent } from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import CheckBox from "expo-checkbox";
import { AuthContext } from "../AuthContext/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {

    const { setAuthUser, baseURL,isVerified, setVerified ,isPhoneVerified ,setPhoneVerified} = useContext(AuthContext);
    const router = useRouter();
    const [isNewsletterEnabled, setNewsletterEnabled] = useState(false);
    const [isTermsChecked, setTermsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const toggleNewsletter = () => setNewsletterEnabled((prev) => !prev);
    const toggleTerms = () => setTermsChecked((prev) => !prev);


    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        phoneNumber: Yup.string().required("phoneNumber is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),
    });

    interface SignUpFormValues {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        phoneNumber:String;
    }
    const handleSubmit = async (values: SignUpFormValues) => {
        if (!isTermsChecked) {
            Alert.alert("Error", "You must accept Terms and Conditions.");
            return;
        }
        
        setIsLoading(true);  
        try {
            const response = await axios.post(`${baseURL}/api/user/register`, {
                email: values.email,
                password: values.password,
                password2: values.confirmPassword,
                fullName: values.name,
                phoneNumber:values.phoneNumber
            });
            if (response.status === 201) {
                Alert.alert("Success", "sign in successfully!");
                const { userId } = response.data;
                console.log(userId);

                setAuthUser(userId);
                await AsyncStorage.setItem('UserId', userId);
                if (isPhoneVerified) {
                    setPhoneVerified(false)
                    router.push("/(tabs)/home");
                }else{
                setVerified(false);
                 if(isVerified ){
                    router.push("/(auth)/SignIn");
                 }else{

                     router.push("/(auth)/VerifyOTP") ;
                 } 
                
            }
            } else if (response.status === 400) {
                Alert.alert("user alerady exists");
            } else {
                Alert.alert("Error", "Failed to log in. Please try again.");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred during sign up.";
            Alert.alert("Error", errorMessage);
            console.log(error);
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Sign Up</Text>

            <Formik
                initialValues={{ name: "", email: "", password: "", confirmPassword: "",phoneNumber:""}}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                    <>
                        {/* Name Field */}
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={values.name}
                            onChangeText={handleChange("name")}
                        />
                        {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                        {/* Email Field */}
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={values.email}
                            onChangeText={handleChange("email")}
                        />
                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                        {/* phone Field */}
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Number"
                            keyboardType="phone-pad"
                            value={values.phoneNumber}
                            onChangeText={handleChange("phoneNumber")}
                        />
                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                        {/* Password Field */}
                        <Text style={styles.label}>Create a Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={values.password}
                            onChangeText={handleChange("password")}
                        />
                        {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                        {/* Confirm Password */}
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={values.confirmPassword}
                            onChangeText={handleChange("confirmPassword")}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.error}>{errors.confirmPassword}</Text>
                        )}

                        {/* Newsletter Toggle */}
                        <View style={styles.toggleContainer}>
                            <Switch value={isNewsletterEnabled} onValueChange={toggleNewsletter} />
                            <View>
                                <Text style={styles.toggleText}>Receive Newsletters</Text>
                                <Text style={styles.toggleSubtext}>Get updates on Death Planning</Text>
                            </View>
                        </View>

                        {/* Terms Checkbox */}
                        <View style={styles.checkboxContainer}>
                            <CheckBox value={isTermsChecked} onValueChange={toggleTerms} color="#4F8EF7" />
                            <Text style={styles.checkboxText}>Accept Terms and Conditions</Text>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity style={styles.button} onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer */}
                        <Text style={styles.footer}>
                            Already have an account?{" "}
                            <Text style={styles.loginText} onPress={() => router.push("/(auth)/SignIn")}>
                                Log In
                            </Text>
                        </Text>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
    header: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 5, color: "#333" },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    error: { color: "red", fontSize: 12, marginBottom: 10 },
    toggleContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    toggleText: { fontWeight: "bold", marginLeft: 10 },
    toggleSubtext: { fontSize: 12, color: "#777", marginLeft: 10 },
    checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    checkboxText: { marginLeft: 10, color: "#555" },
    button: {
        backgroundColor: "#4F8EF7",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, paddingRight: 8 },
    footer: { marginTop: 15, textAlign: "center", fontSize: 14, color: "#333" },
    loginText: { fontWeight: "bold", color: "#4F8EF7" },
});

export default SignUp;
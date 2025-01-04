// Import necessary libraries  
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext/AuthContext';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert, ActivityIndicator, GestureResponderEvent, Button ,Image} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const EditProfile = () => {
  const { authUser, baseURL } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/chats/${authUser}`);

      console.log(response.data.data);

      const structuredMessages = response.data.data.map((chat) => ({

        sender: chat.partnerId,
        lastMessage: chat.lastMessage.text,
        timestamp: chat.timestamp,
        avatar: chat.partner.avatar,
        fullName: chat.partner.fullName,
        type: chat.lastMessage.type,
      }));

      console.log("messages :", structuredMessages);
      setMessages(structuredMessages);

    } catch (error) {
      console.error('Error fetching messages: ', error);
    }
  };


  useEffect(() => {
    fetchMessages();

  }, []);

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
    phoneNumber: String;
  }

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };
  const handleSubmit = async (values: SignUpFormValues) => {


    setIsLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/user/register`, {
        email: values.email,
        password: values.password,
        password2: values.confirmPassword,
        fullName: values.name,
        phoneNumber: values.phoneNumber
      });
      if (response.status === 201) {
        Alert.alert("Success", "sign in successfully!");


      }
      else {
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
    <View style={styles.container}>
      <Header title="Edit Profile">
      </Header>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 40, gap: 4 }}>
        <View style={{ width: 80, height: 80, backgroundColor: '#ccf', borderRadius: 40, overflow: 'hidden' }}>
          {media && media.type && media.type.startsWith('image') ? (
            <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={{ uri: media.uri }} />
          ) : (
            <Ionicons name="image" size={70} color="gray" />
          )}
        </View>
        <Button title="Edit Picture" onPress={pickMedia} />
      </View>
      <Formik
        initialValues={{ name: "", email: "", password: "", confirmPassword: "", phoneNumber: "" }}
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



            
            
            {/* Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Save Details</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginLeft: 10,
    color: '#555',
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadCount: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 12,
  },

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

export default EditProfile;
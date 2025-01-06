import React, { useContext, useState } from "react";  
import axios from "axios";  
import { AuthContext } from "./AuthContext/AuthContext";  
import Header from "@/components/Header";  
import {  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  StyleSheet,  
  Alert,  
  ActivityIndicator,  
  Image,  
} from "react-native";  
import { Formik } from "formik";  
import * as Yup from "yup";  
import * as ImagePicker from 'expo-image-picker';  
import { Ionicons } from "@expo/vector-icons";  
import { router } from "expo-router";

type PickedMedia = {  
  uri: string;  
  type: string;  
  fileName: string;  
} | null;  

interface FormValues {  
  name: string;  
}  

const EditProfile = () => {  
  const { authUser, baseURL } = useContext(AuthContext);  
  const [isLoading, setIsLoading] = useState(false);  
  const [media, setMedia] = useState<PickedMedia>(null);  

  const validationSchema = Yup.object().shape({  
    name: Yup.string().required("Name is required"),  
  });  

  const pickImage = async () => {  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();  
    if (status !== 'granted') {  
      Alert.alert("Permission required", "You need to grant permission to access the library.");  
      return;  
    }  
    
    const result = await ImagePicker.launchImageLibraryAsync({  
      mediaTypes: ImagePicker.MediaTypeOptions.All,  
      allowsEditing: true,  
      quality: 1,  
      aspect: [4, 3],  
    });  

    if (result.canceled) {  
      console.log("User cancelled image picker");  
    } else if (result.assets?.length) {  
    
      
      const { uri, type, fileName } = result.assets[0];  
      setMedia({ uri, type, fileName });  
    }  
  };  

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
  
      // Add profile image if it exists
      if (media?.uri) {  
          formData.append("profileImage", {
            uri: media.uri,
            name: media.fileName || "image.jpg", 
            type: media.type || "image/jpeg",
          }); 
      }
      formData.append("fullName", values.name);
  
      const url = `${baseURL}/api/user/edit-user/${authUser.userId}`;
      console.log("Request URL:", url);
  
      // Log FormData keys and values
      formData.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${JSON.stringify(value)}`);
      });
  
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("Response:", response.data);
      if (response.status >= 200 && response.status < 300) {
        Alert.alert("Success", "Profile updated successfully");
        router.push("/(tabs)/Profile");
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error: any) {
      // Handle errors gracefully
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error("Request details:", error.request);
          Alert.alert("Error", "No response received from the server.");
        } else {
          console.error("Error message:", error.message);
        }
        Alert.alert("Error", error.response?.data?.message || error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (  
    <View style={styles.container}>  
      <Header title="Edit Profile" />  
      <View style={styles.imageContainer}>  
        <View style={styles.imageWrapper}>  
          {media?.uri ? (  
            <Image style={styles.image} source={{ uri: media.uri }} />  
          ) : authUser?.profileImage ? (  
            <Image style={styles.image} source={{ uri: authUser.profileImage }} />  
          ) : (  
            <Ionicons name="image" size={50} color="gray" />  
          )}  
        </View>  
        <TouchableOpacity style={styles.editButton} onPress={pickImage}>  
          <Text style={styles.editButtonText}>Edit Picture</Text>  
        </TouchableOpacity>  
      </View>  
      <Formik<FormValues>  
        initialValues={{ name: authUser?.name || "" }}  
        validationSchema={validationSchema}  
        onSubmit={handleSubmit}  
      >  
        {({ handleChange, handleSubmit, values, errors, touched }) => (  
          <>  
            <Text style={styles.label}>Full Name</Text>  
            <TextInput  
              style={styles.input}  
              placeholder="Enter your name"  
              onChangeText={handleChange("name")}  
              value={values.name}  
            />  
            {touched.name && errors.name && (  
              <Text style={styles.error}>{errors.name}</Text>  
            )}  

            <TouchableOpacity  
              style={[styles.button, isLoading ? styles.disabledButton : null]}  
              onPress={()=>handleSubmit()}  
              disabled={isLoading || (!values.name && !media?.uri)}  
            >  
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
    backgroundColor: "#fff",  
    marginTop:40,
  },  
  imageContainer: {  
    flexDirection: "column",  
    alignItems: "center",  
    marginTop: 40,  
    gap: 10,  
  },  
  imageWrapper: {  
    width: 80,  
    height: 80,  
    backgroundColor: "#f0f0f0",  
    borderRadius: 40,  
    overflow: "hidden",  
    alignItems: "center",  
    justifyContent: "center",  
  },  
  image: {  
    width: "100%",  
    height: "100%",  
    resizeMode: "cover",  
  },  
  label: {  
    fontSize: 16,  
    marginBottom: 5,  
    color: "#333",  
  },  
  input: {  
    height: 50,  
    borderWidth: 1,  
    borderColor: "#ddd",  
    borderRadius: 8,  
    paddingHorizontal: 10,  
    marginBottom: 10,  
  },  
  error: {  
    color: "red",  
    fontSize: 12,  
    marginBottom: 10,  
  },  
  button: {  
    backgroundColor: "#4F8EF7",  
    padding: 12,  
    borderRadius: 8,  
    alignItems: "center",  
  },  
  disabledButton: {  
    backgroundColor: "#ccc",  
  },  
  buttonText: {  
    color: "#fff",  
    fontWeight: "bold",  
    fontSize: 16,  
  },  
  editButton: {  
    backgroundColor: "#4F8EF7", // Change color for the button  
    paddingVertical: 10, // Vertical padding  
    paddingHorizontal: 20, // Horizontal padding  
    borderRadius: 25, // Rounded corners  
    alignItems: "center", // Center the text  
    justifyContent: "center", // Center the text  
    flexDirection: "row", // Allow icon-to-text alignment  
    elevation: 3, // Android shadow  
    shadowColor: "#000", // iOS shadow color  
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset  
    shadowOpacity: 0.3, // iOS shadow opacity  
    shadowRadius: 4, // iOS shadow blur  
  },  
  editButtonText: {  
    color: "#fff", // Text color  
    fontWeight: "bold", // Text weight  
    fontSize: 16, // Text size  
    marginLeft: 10, // Space between icon and text  
  },  
});  

export default EditProfile;
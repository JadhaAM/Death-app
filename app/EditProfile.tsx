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
import * as ImagePicker from "expo-image-picker";  
import { Ionicons } from "@expo/vector-icons";  
import { router } from "expo-router";  

const EditProfile = () => {  
  const { authUser, baseURL } = useContext(AuthContext);  
  const [isLoading, setIsLoading] = useState(false);  

  const validationSchema = Yup.object().shape({  
    name: Yup.string().required("Name is required"),  
  });  

  const pickImage = async (setFieldValue) => {  
    try {  
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();  
      if (status !== "granted") {  
        Alert.alert("Permission Denied", "You need to grant camera roll permissions to upload a profile picture.");  
        return;  
      }  

      const result = await ImagePicker.launchImageLibraryAsync({  
        mediaTypes: ImagePicker.MediaTypeOptions.Images,  
        allowsEditing: true,  
        aspect: [1, 1], // Square cropping  
        quality: 1,  
      });  

      if (!result.canceled) {  
        const uri = result.assets[0].uri;  
        const fileName = uri.split("/").pop();  
        const type = `image/${fileName.split(".").pop()}`;  

        setFieldValue("profileImage", { uri, type, fileName });  
      }  
    } catch (error) {  
      console.error("Error picking image:", error);  
      Alert.alert("Error", "An error occurred while picking the image.");  
    }  
  };  

  const handleSubmit = async (values) => {
  
    setIsLoading(true);
  
    try {
      const formData = new FormData();
   console.log("value of profile image :",values.profileImage);
   
      // Append profile image
      if (values.profileImage) {
        formData.append("profileImage", {
          uri: values.profileImage.uri,
          type: values.profileImage.type || "image/jpeg", // Ensure MIME type
          name: values.profileImage.fileName || "profile.jpg", // Default filename
        });
      }

  
      // Append full name
      formData.append("fullName", values.name);
  
      console.log("FormData contents:", formData);
  
      const userID = authUser.userId;
  
      // Make the API call
      const response = await axios.put(
        `${baseURL}/api/user/edit-user/${userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response data",response);
      
      if (response.status === 200) {
        Alert.alert("Success", "Profile and images updated successfully!");
        router.push("/(tabs)/Profile");
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile and images:", error);
      Alert.alert("Error", "An error occurred while updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (  
    <View style={styles.container}>  
      <Header title="Edit Profile" />  
      

      <Formik  
        initialValues={{  
          name: "",  
          profileImage: null,  
        }}  
        validationSchema={validationSchema}  
        onSubmit={handleSubmit}  
      >  
        {({  
          handleChange,  
          handleSubmit,  
          setFieldValue,  
          values,  
          errors,  
          touched,  
        }) => (  
          <>  
            <View style={styles.imageContainer}>  
              <View style={styles.imageWrapper}>  
                {values.profileImage?.uri ? (  
                  <Image  
                    style={styles.image}  
                    source={{ uri: values.profileImage.uri }}  
                  />  
                ) : authUser?.profileImage ? (  
                  <Image  
                    style={styles.image}  
                    source={{ uri: authUser.profileImage }}  
                  />  
                ) : (  
                  <Ionicons name="image" size={50} color="gray" />  
                )}  
              </View>  
              <TouchableOpacity  
                style={styles.editButton}  
                onPress={() => pickImage(setFieldValue)}  
              >  
                <Text style={styles.editButtonText}>Edit Picture</Text>  
              </TouchableOpacity>  
            </View>  

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
              onPress={handleSubmit}  
              disabled={isLoading || (!values.name && !values.profileImage)}  
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
    marginTop: 40,  
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
    backgroundColor: "#4F8EF7",  
    paddingVertical: 10,  
    paddingHorizontal: 20,  
    borderRadius: 25,  
    alignItems: "center",  
    justifyContent: "center",  
    flexDirection: "row",  
    elevation: 3,  
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: 2 },  
    shadowOpacity: 0.3,  
    shadowRadius: 4,  
  },  
  editButtonText: {  
    color: "#fff",  
    fontWeight: "bold",  
    fontSize: 16,  
    marginLeft: 10,  
  },  
});  

export default EditProfile;  

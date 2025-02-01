import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Formik } from "formik";
import axios from "axios";
import { router } from "expo-router";
import Header from "@/components/Header";
import { AuthContext } from "./AuthContext/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';

const RecentBusinessLog = () => {
  const { business, setBusiness, baseURL } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [headstones, setHeadstones] = useState(
    Array(5).fill({ type: "select type", fees: "", image: null })
  );

  const headstoneTypes = [
    "select type", "FLAT GRAVE", "BEVEL", "SLANTED", "UPRIGHT", "SPECIALTY"
  ];

  const handleHeadstoneChange = (index, field, value) => {
    const updatedHeadstones = [...headstones];
    updatedHeadstones[index] = {
      ...updatedHeadstones[index],
      [field]: value
    };
    setHeadstones(updatedHeadstones);
  };

//   const pickImage = async (index) => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Grant media permissions to upload images.");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         const uri = result.assets[0].uri;  
//         const fileName = uri.split("/").pop();  
//         const type = `image/${fileName.split(".").pop()}`;  
//         const image = {
//           uri,
//           fileName,
//           type
//         }
//         handleHeadstoneChange(index, "image", image.uri);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick image");
//       console.error("Image picking error:", error);
//     }
//   };

//   const handleSubmit = async (values) => {
//     setIsLoading(true);
//     try {
//       const id = admin.business._id;
//       const formData = new FormData();

//       Object.keys(values).forEach((key) => {
//         formData.append(key, values[key]);
//       });
//       console.log("values", values);
      
//       if (admin.business.category === "Headstones") {
//         headstones.forEach((headstone, index) => {
//           if (headstone.type !== "select type") {
//             formData.append(`headstoneNames`, headstone.type);
            
//             if (headstone.fees) {
//               formData.append(`priceStartsFrom`, headstone.fees.toString());
//             }
            
//             if (headstone.image) {
//               const filename = headstone.image.split('/').pop();
//               const match = /\.(\w+)$/.exec(filename);
//               const type = match ? `image/${match[1]}` : 'image/jpeg';
              
//               formData.append(`headstoneImage`, {
//                 uri: headstone.image,
//                 name: filename,
//                 type: type
//               });
//             }
//           }
//         });
//       }

//       for (let pair of formData._parts) {
//         console.log('FormData Entry:', pair[0], pair[1]);
//       }

//       const response = await axios.put(`${baseURL}/api/businesses/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setAdmin(prevAdmin => ({
//         ...prevAdmin,
//         business: {
//           ...prevAdmin.business,
//           ...response.data,
//         },
//       }));

//       Alert.alert("Success", "Profile updated successfully");
//       router.push("/EditBussnesses");
//     } catch (error) {
//       console.error("Error submitting form:", error.response?.data || error.message);
//       Alert.alert(
//         "Error",
//         "Failed to update profile. Please check your inputs and try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

  return (
    <View style={styles.mainContainer}>
      <Formik
        initialValues={{
          businessName: business?.business?.businessName || "",
          email: business?.email || "",
          partnerName: business?.firstName || "",
          category: business?.business?.category || "",
          address: business?.business?.address || "",
          rating: business?.business?.rating?.toString() || "0",
          description: business?.business?.description || "",
          years: business?.business?.years?.toString() || "0",
          clients: business?.business?.clients?.toString() || "0",
          phoneNumber: business?.business?.phoneNumber?.toString() || "",
          reviews: business?.business?.reviews?.toString() || "",
          fees: business?.business?.fees?.toString() || "",
        }}
        
      >
        {({ handleChange, handleSubmit: formikSubmit, values }) => (
          <>
            <ScrollView style={styles.container}>
              <Header title="Recently Add Business" />

              {/* Read-only fields */}
              <Text style={styles.label}>Business Name</Text>
              <Text style={styles.readOnlyField}>{values.businessName}</Text>

             
              <Text style={styles.label}>Category</Text>
              <Text style={styles.readOnlyField}>{values.category}</Text>

              
              <Text style={styles.label}>Address</Text>
              <Text style={styles.readOnlyField}>{values.address}</Text>

              <Text style={styles.label}>Rating</Text>
              <Text style={styles.readOnlyField}>{values.rating}</Text>

              <Text style={styles.label}>fees</Text>
              <Text style={styles.readOnlyField}>{values.fees}</Text>

              <Text style={styles.label}>Description</Text>
              <Text style={styles.readOnlyField}>{values.description}</Text>

              <Text style={styles.label}>Reviews</Text>
              <Text style={styles.readOnlyField}>{values.reviews}</Text>

              <Text style={styles.label}>Years of Experience</Text>
              <Text style={styles.readOnlyField}>{values.years}</Text>

              <Text style={styles.label}>Number of Clients</Text>
              <Text style={styles.readOnlyField}>{values.clients}</Text>

              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.readOnlyField}>{values.phoneNumber}</Text>

              {/* Headstones section */}
              {/* {admin.business.category === "Headstones" && (
                <>
                  <Text style={styles.label2}>Edit Headstones Types</Text>
                  {headstones.map((item, index) => (
                    <View key={index} style={styles.headstoneContainer}>
                      <Text style={styles.label}>Headstone Type {index + 1}</Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={item.type}
                          style={styles.picker}
                          onValueChange={(itemValue) =>
                            handleHeadstoneChange(index, "type", itemValue)
                          }
                        >
                          {headstoneTypes.map((type, i) => (
                            <Picker.Item key={i} label={type} value={type} />
                          ))}
                        </Picker>
                      </View>

                      <Text style={styles.label}>Headstone Fees</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Headstone Fees"
                        keyboardType="numeric"
                        value={item.fees}
                        onChangeText={(text) =>
                          handleHeadstoneChange(index, "fees", text)
                        }
                      />

                      <Text style={styles.label}>Upload Image for Headstone</Text>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() => pickImage(index)}
                      >
                        <Text style={styles.uploadButtonText}>
                          {item.image ? 'Change Image' : 'Pick Image'}
                        </Text>
                      </TouchableOpacity>
                      
                      {item.image && (
                        <Image 
                          source={{ uri: item.image }} 
                          style={styles.imagePreview}
                        />
                      )}
                    </View>
                  ))}
                </>
              )} */}
            </ScrollView>

            {/* <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled
              ]}
              onPress={() => formikSubmit(values)}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Text>
            </TouchableOpacity> */}
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 80,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    fontWeight: "500",
  },
  label2: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  readOnlyField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#555",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  headstoneContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  uploadButton: {
    backgroundColor: "#4F8EF7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    resizeMode: "cover",
  },
  
  submitButtonDisabled: {
    backgroundColor: "#A5C3F7",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default RecentBusinessLog;
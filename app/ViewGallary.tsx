import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext/AuthContext";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";

const ViewGallary = () => {
  const { admin, setAdmin, baseURL } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Maximum images limit
  const maxImages = 10;

  // Load existing images based on category
  useEffect(() => {
    // if (admin?.business?.category === "Headstones") {
    //   // Load images for Headstones category
    //   if (admin?.business?.headstoneImage?.length) {
    //     const existingImages = admin.business.headstoneImage.map((url, index) => ({
    //       uri: url,
    //       type: "image/jpeg", // Assuming default type, adjust as needed
    //       fileName: `image${index + 1}.jpg`,
    //     }));
    //     setImages(existingImages);
    //   }
    // } else
     if (admin?.business?.businessImages?.length) {
      // Load default business images
      const existingImages = admin.business.businessImages.map((url, index) => ({
        uri: url,
        type: "image/jpeg", // Assuming default type, adjust as needed
        fileName: `image${index + 1}.jpg`,
      }));
      setImages(existingImages);
    }
  }, [admin]);

  // Function to pick multiple images
  const pickImages = async () => {
    // if (admin?.business?.category === "Headstones") {
    //   Alert.alert("Upload Disabled", "You cannot upload images for Headstones.");
    //   return;
    // }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Grant media permissions to upload images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Allow multiple image selection
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: `image/${asset.uri.split(".").pop()}`,
          fileName: asset.uri.split("/").pop(),
        }));

        const availableSlots = maxImages - images.length;
        if (selectedImages.length <= availableSlots) {
          setImages((prevImages) => [...prevImages, ...selectedImages]);
        } else {
          Alert.alert(
            "Limit Reached",
            `You can upload a maximum of ${availableSlots} more images.`
          );
          setImages((prevImages) => [
            ...prevImages,
            ...selectedImages.slice(0, availableSlots),
          ]);
        }
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "An error occurred while picking the images.");
    }
  };

  // Function to delete an image
  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Function to upload images to the backend
  const uploadImages = async () => {
    if (images.length === 0) {
      Alert.alert("No Images", "Please upload images before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append images to FormData
      images.forEach((image, index) => {
        formData.append("businessImages", {
          uri: image.uri, // Local file path
          type: image.type || "image/jpeg", // MIME type
          name: image.fileName || `image${index + 1}.jpg`, // Filename
        });
      });

      // Backend API call
      const id = admin.business._id;
      const response = await axios.put(`${baseURL}/api/businesses/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Response from backend:", response.data);

        Alert.alert("Success", "Images uploaded successfully!");
        const updatedBusinessImages = response.data.businessImages;
        setAdmin((prevAdmin) => ({
          ...prevAdmin, // Keep all other properties unchanged
          business: {
            ...prevAdmin.business, // Keep other business properties unchanged
            businessImages: updatedBusinessImages, // Update only the businessImages array
          },
        }));
      } else {
        Alert.alert("Error", "Failed to upload images. Try again.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert("Error", "An error occurred while uploading images.");
    } finally {
      setIsLoading(false);
    }
  };

  const remainingImages = maxImages - images.length;
  // const isDisabled = admin?.business?.category === "Headstones"; // Disable buttons for Headstones

  return (
    <View style={styles.container}>
      <Header title="Image Gallery" />
      <Text style={styles.title}>
        {images.length >= maxImages
          ? "You have reached the maximum limit of 10 images."
          : `You can upload ${remainingImages} more ${ 
              remainingImages === 1 ? "image" : "images"
            }`}
      </Text>

      {/* Image Gallery */}
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Upload Button  !isDisabled &&*/}
      {images.length < maxImages &&  (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
          <Text style={styles.uploadButtonText}>Upload Images</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          isLoading ? styles.disabledButton : null,
          // images.length === 0 || isDisabled ? styles.disabledButton : null,
        ]}
        onPress={uploadImages}
        disabled={isLoading || images.length === 0 }
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Images</Text>
        )}
      </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  uploadButton: {
    backgroundColor: "#4F8EF7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4F8EF7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ViewGallary;

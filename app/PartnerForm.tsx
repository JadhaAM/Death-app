import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import Header from "@/components/Header";
import { AuthContext } from "./AuthContext/AuthContext";
import axios from "axios";

const PartnerForm = () => {
  const { admin, setAdmin,baseURL } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("admin id:", admin.business._id);
      const id = admin.business._id;
      const response = await axios.put(`${baseURL}/api/businesses/${id}`, {
        ...values,
      });
      console.log("Response:", response.data);
      setAdmin((prevAdmin) => ({
        ...prevAdmin,
        business: {
          ...prevAdmin.business,
          address: response.data.address,
          businessImage: response.data.businessImage,
          businessImages: response.data.businessImages,
          businessName: response.data.businessName,
          category: response.data.category,
          clients: response.data.clients,
          description: response.data.description,
          fees: response.data.fees,
          phoneNumber: response.data.phoneNumber,
          rating: response.data.rating,
          years: response.data.years,
        },
      }));
      
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Edit Profile" />

      <Formik
        initialValues={{
          businessName: admin?.business?.businessName || "",
          email: admin?.email || "",
          partnerName: admin?.firstName || "",
          category: admin?.business?.category || "",
          address: admin?.business?.address || "",
          rating: admin?.business?.rating || "",
          description: admin?.business?.description || "",
    
          years: admin?.business?.years || "",
          clients: admin?.business?.clients || "",
          phoneNumber: admin?.business?.phoneNumber || "",
  
        }}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Read-only Fields */}
            <Text style={styles.label}>Business Name</Text>
            <Text style={styles.readOnlyField}>{values.businessName}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.readOnlyField}>{values.email}</Text>

            <Text style={styles.label}>Partner Name</Text>
            <Text style={styles.readOnlyField}>{values.partnerName}</Text>

            <Text style={styles.label}>Category</Text>
            <Text style={styles.readOnlyField}>{values.category}</Text>

            {/* Editable Fields */}
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              onChangeText={handleChange("address")}
              value={values.address}
            />
            {touched.address && errors.address && (
              <Text style={styles.error}>{errors.address}</Text>
            )}

            <Text style={styles.label}>Rating</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter rating (0 to 5)"
              keyboardType="numeric"
              onChangeText={handleChange("rating")}
              value={values.rating}
            />
            {touched.rating && errors.rating && (
              <Text style={styles.error}>{errors.rating}</Text>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              onChangeText={handleChange("description")}
              value={values.description}
            />
            {touched.description && errors.description && (
              <Text style={styles.error}>{errors.description}</Text>
            )}

          

            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter years of experience"
              keyboardType="numeric"
              onChangeText={handleChange("years")}
              value={values.years}
            />
            {touched.years && errors.years && (
              <Text style={styles.error}>{errors.years}</Text>
            )}

            <Text style={styles.label}>Number of Clients</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of clients"
              keyboardType="numeric"
              onChangeText={handleChange("clients")}
              value={values.clients}
            />
            {touched.clients && errors.clients && (
              <Text style={styles.error}>{errors.clients}</Text>
            )}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="numeric"
              onChangeText={handleChange("phoneNumber")}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.error}>{errors.phoneNumber}</Text>
            )}


            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#4F8EF7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  readOnlyField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    color: "#555",
  },
});

export default PartnerForm;

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
import { Formik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { router } from "expo-router";
import Header from "@/components/Header";
import { AuthContext } from "./AuthContext/AuthContext";

const validCategories = [
  "Funeral Homes",
  "Cemeteries",
  "Headstones",
  "Attorneys",
  "Memorial Consulting",
  "Life Insurance",
];

const validationSchema = Yup.object().shape({
  businessName: Yup.string().required("Business name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  partnerName: Yup.string().required("Partner name is required"),
  category: Yup.string()
    .oneOf(validCategories, "Invalid category")
    .required("Category is required"),
  address: Yup.string().required("Address is required"),
  rating: Yup.number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5")
    .required("Rating is required"),
  description: Yup.string(),
  years: Yup.number()
    .min(0, "Years must be positive")
    .required("Years is required"),
  clients: Yup.number()
    .min(0, "Number of clients must be positive")
    .required("Number of clients is required"),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  reviews: Yup.number()
    .min(0, "Number of reviews must be positive")
    .required("Number of reviews is required"),
});

const AddBusinesses = () => {
  const { admin, setBusiness, baseURL } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Trim all string values and convert numbers to strings
      Object.keys(values).forEach((key) => {
        let value = values[key];
        if (typeof value === "string") {
          value = value.trim();
        }
        formData.append(key, value.toString());
      });

      // Log form data for debugging
      for (let pair of formData._parts) {
        console.log("FormData Entry:", pair[0], pair[1]);
      }

      const response = await axios.post(
        `${baseURL}/api/businesses/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setBusiness((prevAdmin) => ({
        ...prevAdmin,
        business: {
          ...prevAdmin.business,
          ...response.data,
        },
      }));

      Alert.alert("Success", "Business added successfully");
      router.push("/RecentBusinessLog");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message,
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to add business. Please check your inputs and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Formik
        initialValues={{
          businessName: "",
          email: "",
          partnerName: "",
          category: "",
          address: "",
          rating: "0",
          description: "",
          years: "0",
          clients: "0",
          phoneNumber: "",
          reviews: "0",
          fees: "0",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit: formikSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <ScrollView style={styles.container}>
              <Header title="Add Business" />

              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.businessName &&
                    touched.businessName &&
                    styles.inputError,
                ]}
                placeholder="Enter Business Name"
                onChangeText={handleChange("businessName")}
                value={values.businessName}
              />
              {errors.businessName && touched.businessName && (
                <Text style={styles.errorText}>{errors.businessName}</Text>
              )}

              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select category" value="" />
                  {validCategories.map((category) => (
                    <Picker.Item
                      key={category}
                      label={category}
                      value={category}
                    />
                  ))}
                </Picker>
              </View>
              {errors.category && touched.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}

              {/* Add similar error handling for other fields */}

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                onChangeText={handleChange("address")}
                value={values.address}
              />

              <Text style={styles.label}>Rating</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter rating (0 to 5)"
                keyboardType="numeric"
                onChangeText={handleChange("rating")}
                value={values.rating}
              />
              <Text style={styles.label}>fees</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter fees"
                keyboardType="numeric"
                onChangeText={handleChange("fees")}
                value={values.fees}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
                onChangeText={handleChange("description")}
                value={values.description}
              />

              <Text style={styles.label}>Reviews</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reviews"
                keyboardType="numeric"
                onChangeText={handleChange("reviews")}
                value={values.reviews}
              />

              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter years of experience"
                keyboardType="numeric"
                onChangeText={handleChange("years")}
                value={values.years}
              />

              <Text style={styles.label}>Number of Clients</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter number of clients"
                keyboardType="numeric"
                onChangeText={handleChange("clients")}
                value={values.clients}
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                keyboardType="numeric"
                onChangeText={handleChange("phoneNumber")}
                value={values.phoneNumber}
              />
              {/* Rest of the form fields remain the same but with error handling */}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={() => formikSubmit(values)}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? "Adding..." : "Add Business"}
              </Text>
            </TouchableOpacity>
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
  submitButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#4F8EF7",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#A5C3F7",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});

export default AddBusinesses;

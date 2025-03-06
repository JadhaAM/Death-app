import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const plans = [
  { id: "1", name: "Monthly", price: "$29.99 / mo" },
  { id: "2", name: "Annual", price: "$15.99 / mo ($192 / year)" },
  { id: "3", name: "Free trial", price: "1 month free" },
];

const ChoosePlan = () => {
  const [selectedPlan, setSelectedPlan] = useState("Monthly");

  const handleContinue = () => {
    alert(`Selected Plan: ${selectedPlan}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your plan</Text>
      <Text style={styles.subtitle}>
        To complete the sign up process, please make the payment
      </Text>
      {plans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[
            styles.planItem,
            selectedPlan === plan.name && styles.selectedItem,
          ]}
          onPress={() => setSelectedPlan(plan.name)}
        >
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{plan.price}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  planItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedItem: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ChoosePlan;

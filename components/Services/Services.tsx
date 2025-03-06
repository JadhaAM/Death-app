import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { Image } from "expo-image";
import axios from "axios";
import funeralHomeIcon from "../../assets/icons/funeralHome.png";
import cemeteryIcon from "../../assets/icons/cemeteryIcon.png";
import headstoneIcon from "../../assets/icons/headstoneIcon.png";
import attorneyIcon from "../../assets/icons/attorneyIcon.png";
import insuranceIcon from "../../assets/icons/insuranceIcon.png";
import { useNavigation, useRouter } from "expo-router";
import { AuthContext } from "@/app/AuthContext/AuthContext";

const Services = () => {
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState(null); // to store fetched service data
  const navigation = useNavigation();
  const router = useRouter();
  const { authUser, baseURL } = useContext(AuthContext);

  const servicesList = [
    {
      name: "Funeral Homes",
      icon: funeralHomeIcon,
      endpoint: "/api/businesses/Funeral Homes", // Replace with actual endpoint
    },
    {
      name: "Cemeteries",
      icon: cemeteryIcon,
      endpoint: "/api/businesses/Cemeteries", // Replace with actual endpoint
    },
    {
      name: "Headstones",
      icon: headstoneIcon,
      endpoint: "/api/businesses/Headstones", // Replace with actual endpoint
    },
    {
      name: "Attorneys",
      icon: attorneyIcon,
      endpoint: "/api/businesses/Attorneys", // Replace with actual endpoint
    },
    {
      name: "Memorial Consulting",
      icon: insuranceIcon,
      endpoint: "/api/businesses/Memorial Consulting", // Replace with actual endpoint
    },
    {
      name: "Insurance",
      icon: insuranceIcon,
      endpoint: "/api/businesses/Life Insurance", // Replace with actual endpoint
    },
  ];

  const fetchServiceData = async (endpoint, name) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}${endpoint}`);
      const data = response.data.map((item) => ({
        _id: item._id,
        businessName: item.businessName,
        rating: item.rating,

        category: item.category,
        reviews: item.reviews || 0,
        description: item.description, // Only for attorneys
        availability: item.availability, // Only for attorneys
        fees: item.fees, // Only for attorneys
        clients: item.clients, // Only for attorneys
        years: item.years, // Only for attorneys
        address: item.address, // Only for headstones
        priceStartsFrom: item.priceStartsFrom, // Only for headstones
        headstoneImage: item.headstoneImage,
        phoneNumber: item.phoneNumber,
        businessImages: item.businessImages,
        headstoneNames: item.headstoneNames,
      }));

      console.log("messages :", data);

      setServiceData(data); // store the fetched data
      setLoading(false);
      router.push({
        pathname: "/Listings",
        params: {
          title: name,
          list: JSON.stringify(data), // pass the fetched data
        },
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const ServiceItem = ({ title, icon, endpoint }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => fetchServiceData(endpoint, title)}
      >
        <Image source={icon} style={{ height: 25, width: 25 }} />
        <Text style={styles.itemName}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.serviceListContainer}>
          {servicesList.map((service, index) => (
            <ServiceItem
              key={index}
              title={service.name}
              icon={service.icon}
              endpoint={service.endpoint}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  itemContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#3E69FE",
    width: "30%",
    gap: 5,
    height: 80,
  },
  serviceListContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  itemName: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 18,
  },
});

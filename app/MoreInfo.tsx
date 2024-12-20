import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import Header from "@/components/Header";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import reviews from "../assets/icons/reviews.png";
import years from "../assets/icons/years.png";
import clients from "../assets/icons/clients.png";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const StatsList = [
  {
    title: "Years",
    value: "116",
    img: years,
  },
  {
    title: "Clients",
    value: "120",
    img: clients,
  },
  {
    title: "Reviews",
    value: "96",
    img: reviews,
  },
];

const MoreInfo = () => {
  const { title, name, image, rating, location, desc } = useLocalSearchParams();

  const StatsItem = ({ title, value, img }) => (
    <View style={styles.statsItem}>
      <View style={styles.statsImgCont}>
        <Image source={img} style={styles.statsImg} contentFit="contain" />
      </View>
      <Text style={styles.statsValue}>{value}+</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );

  const handleCallPress = () => {
    const phoneNumber=9678542175
      const phoneURL = `tel:${phoneNumber}`;
  
      Linking.canOpenURL(phoneURL)
        .then((supported) => {
          if (supported) {
            Linking.openURL(phoneURL);
          } else {
            Alert.alert("Error", "Unable to make a call. Calling feature is not supported on this device.");
          }
        })
        .catch((err) => console.error("Error opening phone app:", err));
    };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} />

      {/* ------------------ Top container ----------------------*/}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.productImg}
            source={
              image ||
              "https://images.unsplash.com/photo-1680821488873-8ecaf386a554?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <TouchableOpacity style={styles.likeBtn}>
            <Ionicons name="heart-outline" size={22} color="#3E69FE" />
          </TouchableOpacity>
        </View>

        {/* -----------------Middle Container ------------------- */}

        {/* Details */}
        <View>
          {/* Name and rating */}
          <View style={styles.nameCont}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.ratingCont}>
              <Octicons name="star-fill" size={24} color="#FFD33C" />
              <Text style={styles.rating}>{rating} (96 reviews)</Text>
            </View>
          </View>
          {/* Address */}
          <Text style={styles.address}>{location}</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsCont}>
          {StatsList.map((item, index) => (
            <StatsItem
              key={index}
              title={item.title}
              value={item.value}
              img={item.img}
            />
          ))}
        </View>

        {/* Info */}
        <View style={{ marginTop: 15 }}>
          <Text style={styles.infoTitle}>About this cemetery</Text>
          <Text style={styles.infoValue}>
            {desc ||
              "Gutterman’s is a family owned and operated funeral home that has been serving the Jewish community of New York City since 1892. With over 100 years of experience directing Jewish funerals, Gutterman’s is one of the largest family owned and operated firms of its kind in the nation."}
          </Text>
        </View>

        {/* ------------------------ Bottom Container --------------------- */}
        {/* CTA buttons */}
        <View style={styles.ctaBtnsCont}>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: "#3FC066" }]}
          >
            <Feather name="phone" size={24} color="#fff" />
            <Text style={styles.ctnBtnText} onPress={handleCallPress}>Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: "#CE4D3C" }]}
          >
            <MaterialCommunityIcons
              name="message-badge-outline"
              size={24}
              color="#fff"
            />
            <Text style={styles.ctnBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoreInfo;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  productImg: {
    height: 220,
    width: "100%",
    borderRadius: 40,
  },
  imageContainer: {
    position: "relative",
  },
  likeBtn: {
    position: "absolute",
    top: 15,
    right: 20,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
  },
  nameCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    // backgroundColor: "#f0f",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  rating: {
    fontSize: 12,
    color: "#000",
    textAlign: "right",
  },
  ratingCont: {
    flex: 0.7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  address: {
    fontSize: 14,
    marginTop: 10,
    color: "#878787",
    width: 200,
  },
  statsCont: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  statsItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    gap: 5,
  },
  statsTitle: {
    fontSize: 14,
    color: "#878787",
  },
  statsValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statsImgCont: {
    backgroundColor: "#F5F5FF",
    borderRadius: 50,
    height: 70,
    width: 70,
    padding: 12,
    marginBottom: 10,
    objectFit: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  statsImg: {
    height: "80%",
    width: "80%",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  infoValue: {
    fontSize: 14,
    color: "#878787",
    marginTop: 10,
  },
  ctaBtnsCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 20,
    width: "100%",
  },
  ctaBtn: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  ctnBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext/AuthContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import Header from "@/components/Header";
import { Ionicons, Octicons } from "@expo/vector-icons";
import reviews from "../assets/icons/reviews.png";
import years from "../assets/icons/years.png";
import clients from "../assets/icons/clients.png";
import HeadstonesList from "@/components/TopResultsList/HeadstonesList";
import { useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-swiper";


const EditBusinesses = () => {
  const { admin, baseURL } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  console.log("Admin details:", admin);
  useFocusEffect(
    React.useCallback(() => {
      console.log("Admin state on focus:", admin);
    }, [admin])
  );
  const StatsList = [
    {
      title: "Years",
      value: admin?.business?.years,
      img: years,
    },
    {
      title: "Clients",
      value: admin?.business?.clients,
      img: clients,
    },
    {
      title: "Reviews",
      value: admin?.business?.reviews,
      img: reviews,
    },
  ]; const parsedBusinessImages = admin?.business.businessImages ? admin?.business?.businessImages : [];
  const parsedHeadstoneNames = admin?.business.headstoneNames ? admin?.business?.headstoneNames : [];
  const items = parsedHeadstoneNames.map((headstoneName, index) => ({
    _id: index.toString(),
    name: headstoneName,
    image: parsedBusinessImages[index] || "https://via.placeholder.com/150", // Default image if missing
    priceRange: admin?.business?.priceStartsFrom[index] || "$0.00 - $0.00", // Default price range
  }));
  const StatsItem = ({ title, value, img }) => (
    <View style={styles.statsItem}>
      <View style={styles.statsImgCont}>
        <Image source={img} style={styles.statsImg} contentFit="contain" />
      </View>
      <Text style={styles.statsValue}>{value}+</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  ); 
  
  return (
    <ScrollView style={styles.container}>
      <Header title="Edit Business" />

      {/* Profile Image Section */}
      <View style={styles.imageContainer}>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.editButton]}
            onPress={() => router.push("/PartnerForm")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton]}
            onPress={() => router.push("/ViewGallary")}
          >
            <Text style={styles.editButtonText}>View Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.swiperContainer}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          showsPagination={true}
        >
          {parsedBusinessImages.map((img, index) => (
            <View key={index} style={styles.slide}>
              <Image source={{ uri: img }} style={styles.productImg} />
            </View>
          ))}
        </Swiper>
         
      </View>

        {/* -----------------Middle Container ------------------- */}

        {/* Details */}
        <View>
          {/* Name and rating */}
          <View style={styles.nameCont}>
            <View>

              <Text style={styles.name}>{admin?.business?.businessName}</Text>
              {admin?.business?.category === "Attorney" && (
                <>
                  <Text style={styles.Subname}>Senior Attorney</Text>
                </>
              )}
              {/* <Text style={styles.Subname}>{admin?.business?.fees ? `Fees: start from $ ${admin?.business?.fees}` : `Fees: 0`}</Text> */}
            </View>
            <View style={styles.ratingCont}>
              <Octicons name="star-fill" size={24} color="#FFD33C" />
              <Text style={styles.rating}>{admin?.business?.rating} </Text>
            </View>
          </View>
          {/* Address */}
          <Text style={styles.address}>{admin?.business?.address}</Text>
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
            {admin?.business?.description ||
              "Gutterman’s is a family owned and operated funeral home that has been serving the Jewish community of New York City since 1892. With over 100 years of experience directing Jewish funerals, Gutterman’s is one of the largest family owned and operated firms of its kind in the nation."
            }
          </Text>
        </View>
        {admin?.business?.category === "Headstones" && items.length > 0 && (
          <HeadstonesList title="Headstones available" items={items} />
        )}


      </ScrollView>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop:40,
  },
  productImg: {
    height: 220,
    width: "100%",
    borderRadius: 40,
  },
  swiperContainer: {
    height: 270,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  wrapper: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: "relative",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
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
  Subname: {
    fontSize: 18,
    fontWeight: "normal",
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
    margin: 10,
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
  image: {
    width: 160,
    height: 120,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4F8EF7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});

export default EditBusinesses;

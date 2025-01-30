import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import React, { useContext, useEffect } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { AuthContext } from "./AuthContext/AuthContext";
import HeadstonesList from "@/components/TopResultsList/HeadstonesList";

const StatsList = [
  {
    title: "Years",
    value: years,
    img: years,
  },
  {
    title: "Clients",
    value: clients,
    img: clients,
  },
  {
    title: "Reviews",
    value: reviews,
    img: reviews,
  },
];

const MoreInfo = () => {
  const { title, name, fees, role, rating, location, desc, category, id, phoneNumber, years,reviews,
    clients, priceStartsFrom, headstoneImage,businessImages, headstoneNames } = useLocalSearchParams();
  const { authUser, setauthUser, setUserId, userId, setToken, baseURL, setReceiverId } = useContext(AuthContext);

  const StatsItem = ({ title, value, img }) => (
    <View style={styles.statsItem}>
      <View style={styles.statsImgCont}>
        <Image source={img} style={styles.statsImg} contentFit="contain" />
      </View>
      <Text style={styles.statsValue}>{value}+</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );

  // Dynamically build the `items` array
   const image=businessImages ? JSON.parse(businessImages) : [];
  const parsedHeadstoneImages = headstoneImage ? JSON.parse(headstoneImage) : [];
  const parsedHeadstoneNames = headstoneNames ? JSON.parse(headstoneNames) : [];
  const parsedpriceStartsFrom = priceStartsFrom ? JSON.parse(priceStartsFrom) : [];
  const items = parsedHeadstoneNames.map((headstoneName, index) => ({
    _id: index.toString(),
    name: headstoneName,
    image: parsedHeadstoneImages[index] || "https://via.placeholder.com/150", // Default image if missing
    priceRange: parsedpriceStartsFrom[index] || "$0.00 - $0.00", // Default price range
  }));
  const handleCallPress = async () => {
    try {
      console.log(`Business ID: ${id}`);


      const businessId = id;
      const phoneURL = `tel:${phoneNumber}`;

      // Check if the phone app can be opened
      const supported = await Linking.canOpenURL(phoneURL);
      if (supported) {
        // Open the phone dialer
        await Linking.openURL(phoneURL);

        // Navigate to ContactLog screen after phone app opens successfully
        console.log("Phone dialer opened successfully. Navigating to ContactLog...");
        const Contact = await axios.post(`${baseURL}/api/businesses/create-contact`, {
          userId: authUser.userId,
          businessId: businessId,
        })
        if (Contact.status === 201) {
          router.push({
            pathname: "/ContactLog",
            params: {
              name: name,
              businessId: businessId,
            }
          });
        }

      } else {
        // Alert the user if calling isn't supported
        Alert.alert(
          "Error",
          "Unable to make a call. Calling feature is not supported on this device."
        );
      }
    } catch (err) {
      // Log any unexpected errors
      console.error("Error in handleCallPress:", err);
    }
  };



  const MessagePress = async () => {
    try {
      console.log(`receiver id :${id}`);
      const fullName = name;
      const receiverId = id
      router.push({
        pathname: "/ChatScreen",
        params: {
          name: name,
          receiver: receiverId,
        },
      });
    } catch (error) {
      console.log("user id error :", error);

    }

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
            source={{
              uri:
              image[0] || parsedHeadstoneImages[0]
                
            }}
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
            <View><Text style={styles.name}>{name}</Text>
              <Text style={styles.Subname}>{role }</Text>
              {/* <Text style={styles.Subname}>{fees ? `Fees: start from $ ${fees}` : ``}</Text> */}
            </View>

            <View style={styles.ratingCont}>
              <Octicons name="star-fill" size={24} color="#FFD33C" />
              <Text style={styles.rating}>{rating} </Text>
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
            {desc}
          </Text>
        </View>
        {category === "Headstones" && items.length > 0 && (
          <HeadstonesList title="Headstones available" items={items} />
        )}
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
            <Text style={styles.ctnBtnText} onPress={MessagePress}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



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
export default MoreInfo;
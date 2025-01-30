import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, ScrollView, Text, View } from "react-native";
import TopBar from "@/components/TopBar/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import Services from "@/components/Services/Services";
import TopResultsList from "@/components/TopResultsList/TopResultsList";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import { router } from "expo-router";

interface BusinessItem {
  _id: string;
  businessName: string;
  rating: number;
  reviews: number;
  category:String,
  designation?: string; // For attorneys
  availability?: string; // For attorneys
  fees?: string; // For attorneys
  location?: string; // For headstones
  businessImage: string;
  phoneNumber:Number;
  businessImages:String;
}

const Home = () => {
  const { isSurvyDone,baseURL } = useContext(AuthContext);
  const [attorneys, setAttorneys] = useState<BusinessItem[]>([]);
  const [headstones, setHeadstones] = useState<BusinessItem[]>([]);

  useEffect(() => {
    if(!isSurvyDone) {
      router.push("/(auth)/Survey");
    }
  }, [isSurvyDone]);

  const fetchData = async (category: string, setData: React.Dispatch<React.SetStateAction<BusinessItem[]>>) => {
    try {
      const response = await axios.get(`${baseURL}/api/businesses/${category}`);
      const data = response.data.map((item: any) => ({
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
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${category} data:`, error);
    }
  };

  useEffect(() => {
    fetchData("Attorneys", setAttorneys);
    fetchData("Headstones", setHeadstones);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View>
          {/* Top Section */}
          <TopBar />

          {/* Services */}
          <Services />

          {/* Top Attorneys */}
          <TopResultsList
            title="Top Attorneys"
            items={attorneys}
          />

          {/* Memorial Consulting Section */}
          <View style={styles.iconContainer}>
            <Text style={styles.title}>Top Memorial Consulting</Text>
            <Image
              source={require("../../assets/images/memorial1.png")}
              style={styles.imageComponent}
            />
          </View>

          {/* Top Headstones */}
          <TopResultsList
            title="Top Headstones"
            items={headstones}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconContainer: {
    flex: 1,
    margin: 0,
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  imageComponent: {
    width: 335,
    height: 200,
    borderWidth: 3,
    margin: 12,
    borderRadius: 15,
    borderColor: "rgb(30, 29, 29)",
    resizeMode: "cover",
  },
});

export default Home;

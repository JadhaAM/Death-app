import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Searchbar from "./Searchbar";
import { AuthContext } from "@/app/AuthContext/AuthContext";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';

const TopBar = () => {
  const { authUser, setAuthUser, baseURL ,setUserId ,userId } = useContext(AuthContext);
  const { token } = useLocalSearchParams();
  const [user,setUser]=useState();
  useEffect(() => {
    // Check if there's a token in the URL  
    if (token) {

      // // Verify and decode the token  
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;     
      AsyncStorage.setItem('authToken', userId);
      setAuthUser(userId);
    } else {
      console.log("No token found");
    }
  }, [token]);
  const fetchUserData = async () => {

    try {


      const response = await axios.post(`${baseURL}/api/user/profile`, {
        userID: authUser.userId,  // Sending userID in the request body
      }); // Replace with your API endpoint

      setUser(response.data.user);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data");
      console.error(error);
    }
  };
   
  useEffect(() => {
    fetchUserData();
  }, []);
  console.log(authUser);
  console.log(user);
  
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImg}
          source={
            {
               uri: userId.avatar ? userId.avatar : "https://plus.unsplash.com/premium_photo-1691003661129-3af2949db30a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            }
          }
        />
        <TouchableOpacity onPress={() => router.push("/NotificationScreen")}>

          <FontAwesome6 name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Name and Greetings */}
      <View style={styles.nameContainer}>
        <Text style={styles.greeting}>Hello</Text>
        <Text style={styles.name}> {userId.fullName}!</Text>
      </View>

      <View style={styles.imageContainer}>
        <Searchbar />
        <Image
          source={"https://img.icons8.com/ios/50/sorting-options--v1.png"}
          style={{ height: 30, width: 30 }}
        />
      </View>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 20,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 5,
    paddingHorizontal: 10,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "bold",
  },
  name: {
    fontSize: 30,
    fontWeight: "200",
  },
});

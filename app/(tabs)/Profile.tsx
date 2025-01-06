import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const router = useRouter();
  const { authUser, setauthUser,setUserId ,userId, setToken , baseURL} = useContext(AuthContext);

  const fetchUserData = async () => {

    try {
      const response = await axios.post(`${baseURL}/api/user/profile`, {
        userID: authUser.userId,
      });


      setUserId(response.data.user);
    } catch (error) {
      console.log(error);
      
      Alert.alert("Error", "Failed to fetch user data");
    }
  };
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken(null);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.get(`${baseURL}/api/user/logout`);
      Alert.alert("Success", "You have been signed out");
      clearAuthToken();
      router.push("/(auth)/SignIn");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");

    }
    
    
  };
  const handelopenWhatsApp = () => {
    const phoneNumber=+19376088018
    const whatsappURL = `https://wa.me/${phoneNumber}`;
  
    Linking.canOpenURL(whatsappURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappURL);
        } else {
          Alert.alert(
            "Error",
            "Unable to open WhatsApp. Please ensure the app is installed on your device."
          );
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };
   const handelLegal=()=>{
     const LegalURL = `https://docs.google.com/document/d/1AQA8Y22eK6LOwhEB5o5vApD4Fd_PlAUG5ice6DF2EO8/edit`;  
            Linking.openURL(LegalURL).catch(err => {  
                Alert.alert("Error", "Failed to open Google login.");  
            });
   }

  useEffect(() => {
    fetchUserData();
  }, []);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{
          
          
          uri: userId.profileImage ? userId.profileImage : "https://plus.unsplash.com/premium_photo-1691003661129-3af2949db30a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>Hi, {userId.fullName}</Text>
          <Text style={styles.userAge}>{ } Year old</Text>
        </View>
      </View>

      {/* Menu Items */}
      <TouchableOpacity style={styles.menuItem}  onPress={()=>router.push("/EditProfile")} >
        <FontAwesome name="edit" size={24} color="#4A4A4A" />
        <Text style={styles.menuText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={()=>router.push("/ContactLog")}>
        <Ionicons name="business-outline" size={24} color="#4A4A4A" />
        <Text style={styles.menuText}>Contacted Business</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.menuItem} onPress={handelLegal}>
        <Ionicons name="document-text-outline" size={24} color="#4A4A4A" />
        <Text style={styles.menuText}>Legal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handelopenWhatsApp} >
        <Ionicons name="logo-whatsapp" size={24} color="#4A4A4A" />
        <Text style={styles.menuText}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={24} color="#4A4A4A" />
        <Text style={styles.menuText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    resizeMode:"cover",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userAge: {
    fontSize: 14,
    color: "#777",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 16,
    color: "#4A4A4A",
    marginLeft: 15,
  },
});

export default Profile;

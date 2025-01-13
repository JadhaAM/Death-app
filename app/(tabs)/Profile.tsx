import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking ,Modal} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const router = useRouter();
  const { authUser, setauthUser,setUserId ,userId, setToken , baseURL} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchUserData = async () => {

    try {
      const response = await axios.post(`${baseURL}/api/user/profile`, {
        userID: authUser.userId,
      });


      setUserId(response.data.user);
    } catch (error) { 
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
      
      
      router.push("/(auth)/SignIn");
    } catch (error) {
    

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
  const handleTermsAndConditions = () => {
    const termsURL = `https://drive.google.com/file/d/1TgylF2iXPhb0EyojtOG3zI8FFaK3h2ZN/view?usp=sharing`;
    Linking.openURL(termsURL).catch((err) =>
      Alert.alert("Error", "Failed to open Terms and Conditions.")
    );
  };

  const handlePrivacyPolicy = () => {
    const policyURL = `https://drive.google.com/file/d/165j4uxjdjjZKsKtVJ97fQiMv4jnHsjt9/view?usp=sharing`;
    Linking.openURL(policyURL).catch((err) =>
      Alert.alert("Error", "Failed to open Privacy Policy.")
    );
  };

  // Toggle modal visibility
  const handleLegal = () => {
    setModalVisible(true);
  };

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
          {/* <Text style={styles.userAge}>{ } Year old</Text> */}
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


      <TouchableOpacity style={styles.menuItem} onPress={handleLegal}>
        <Ionicons name="document-text-outline" size={24} color="#4A4A4A" />
        <Text style={styles.menuText}>Legal</Text>
      </TouchableOpacity>
       {/* Modal for Legal Options */}
       <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Legal Options</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleTermsAndConditions}
            >
              <Text style={styles.modalButtonText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePrivacyPolicy}
            >
              <Text style={styles.modalButtonText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#d9534f",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Profile;

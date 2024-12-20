import React, { createContext, useState, useEffect } from "react";
import { Client, Account } from "appwrite";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Initialize Appwrite Client
const endpoint =process.env.EXPO_PUBLIC_APP_ENDPOINT
const projectId =process.env.EXPO_PUBLIC_APP_ID
 
const client = new Client();
client
  .setEndpoint(endpoint) // Your Appwrite endpoint
  .setProject(projectId) // Replace with your Appwrite Project ID
  

const account = new Account(client);


// Create Context
 const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session
  const checkSession = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    checkSession();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email,password);
      const userData = await account.get();
      
      await account.createEmailToken(userData.$id,userData.email);
      console.log("email sent ");
      
      await account.createVerification("http://localhost:8081/home");
      setUser(userData);
    } catch (error) {
    
      throw error;
    }
  };

  // Logout Function
  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  // Sign-Up Function
  const signup = async (email, password, name) => {  
    try {  
        // Validate input parameters  
        if (!email || !password || !name) {  
            throw new Error("Email, password, and name are required.");  
        }  

        // Step 1: Create a new user account  
        
        
        // Create a new user account with a validated userId  
        await account.create("unique()", email, password, name); // Adjust if you need unique() or other logic  
        
         // Ensure correct URL  

        console.log("User successfully signed up and saved to the database");  

    } catch (error) {  
        console.error("Error signing up user:", error);  
        throw error; // Rethrow error to be handled in your calling function  
    }  
};
  
  

  // Continue with Google (OAuth)
 

const ContinueWithGoogle = async () => {
  const navigation = useNavigation(); // Get navigation object
  const successUrl ="http://localhost:8081/home";
  const failureUrl ="http://localhost:8081/(auth)/SignInOption"
  Alert.alert("going to login");
  try {
    // Trigger Google OAuth2 Session
  const result=  await account.createOAuth2Session(
      "google",
      successUrl, // Replace with your app's scheme or deep link for success
      failureUrl  // Replace with your app's scheme or deep link for failure
    );
  console.log(result);
    // If the OAuth2 session is successful, fetch user data
    const userData = await account.get();
    console.log("Google Login Successful: ", userData);

    // Redirect to Home Screen or desired route
    navigation.navigate("(tabs)/home");
  } catch (error) {
    console.error("Google Login Failed: ", error.message);

    // Redirect to SignInOption Screen or show an alert
    navigation.navigate("SignInOption");
   
  }
};
 const Emailverification =async (email) => {
  try {
        
        console.log("am going");
       
          
          Alert.alert("on going");
        const result=  await account.createEmailToken(user.$id,email);
        await account.updateVerification(
          result.userId, // userId
          result.secret // secret
      );
       
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.',error.message);
      }
 }

const sendOTP = async (phoneNumber) => {  
  // Remove any spaces to comply with Appwrite requirements  
  const formattedPhoneNumber = phoneNumber.replace(/\s+/g, '');  
  console.log("Sending OTP to:", formattedPhoneNumber);  

  try {  
   const otp= await account.createPhoneToken("unique()", formattedPhoneNumber);  
           
   console.log(otp);
    return otp;  
    
  } catch (error) {  
    throw error;  
  }  
};

const verifyOTP = async () => {
  try {
    
   const verifyOTP= await account.updatePhoneVerification(
      result.userId, // userId
      result.secret // secret
  );
   
  console.log(verifyOTP);
  
    
  } catch (error) {
    throw error;
  }
};

  return (
    <AuthContext.Provider value={{ account, login, logout, signup, loading, ContinueWithGoogle ,sendOTP,verifyOTP ,Emailverification }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
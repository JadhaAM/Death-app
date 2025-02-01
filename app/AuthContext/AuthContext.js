import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import 'core-js/stable/atob';
import { Platform } from 'react-native';
import * as Network from 'expo-network';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_kEY;
  const apiUrl2 = process.env.EXPO_PUBLIC_API_kEY2;
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [isVerified, setVerified] = useState(false);
  const [isPhoneVerified, setPhoneVerified] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSurvyDone, setSurvyDone] = useState(false);
  const [receiverId,setReceiverId] =useState('');
  const [admin ,setAdmin]=useState('')
  const [business ,setBusiness]=useState('')
     
 useEffect(() => {
  const fetchUser  = async () => {
   try {
     const storedToken = await AsyncStorage.getItem('authToken');
     console.log('Stored Token:', storedToken); 

     if (storedToken) {
       const decodedToken = jwtDecode(storedToken);
       console.log('Decoded Token:', decodedToken);  
       setUserId(decodedToken.userId);
        setAuthUser (decodedToken);
        setToken(storedToken);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };
    
  
    fetchUser();
  }, []);

  const [baseURL, setBaseURL] = useState(apiUrl);

  useEffect(() => {
    const fetchBaseURL = async () => {
      if (Platform.OS === 'web') {
        setBaseURL(apiUrl2);
      } else {
        try {
          const ipAddress = await Network.getIpAddressAsync();
          setBaseURL(apiUrl2);
        } catch (error) {
          console.error('Error fetching IP:', error);
          setBaseURL(apiUrl);
        }
      }
    };

    fetchBaseURL();
  }, []);

  console.log(baseURL);

  return (
    <AuthContext.Provider
      value={{
        token,
        baseURL,
        setBaseURL,
        setToken,
        userId,
        setUserId,
        authUser,
        setAuthUser,
        admin ,
        setAdmin ,
        business,
        setBusiness,
        isVerified,
        setVerified,
        isSurvyDone, 
        setSurvyDone,
        isPhoneVerified,
        setPhoneVerified,
        setReceiverId,
        receiverId,
        isResettingPassword,
        setIsResettingPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

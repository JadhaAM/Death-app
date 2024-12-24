import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import 'core-js/stable/atob';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

 useEffect(() => {
    const fetchUser = async () => {
      
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        console.log('Stored Token:', storedToken); 
       
          const decodedToken = jwtDecode(storedToken);
          console.log('Decoded Token:', decodedToken);  
          setUserId(decodedToken.userId);
          setAuthUser(decodedToken);
          setToken(storedToken);
           
      
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };
  
    fetchUser();
  }, []);
  console.log(authUser);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userId,
        setUserId,
        authUser,
        setAuthUser,
        isVerified,
        setVerificationState: setIsVerified,
        isResettingPassword,
        setResetPasswordState: setIsResettingPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

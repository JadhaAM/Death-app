import { Image } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../AuthContext/AuthContext";


export default function HomeStackLayout() {
  return (
    <AuthProvider>
    <Stack screenOptions={
      { headerShown: true ,
        headerTitle: '',
         headerRight: () => (
     <Image
               source={require('../../assets/images/Star 8.png')}
               style={{ width: 46,height: 44,marginRight: 10 }}
             />
    ), }}>
      <Stack.Screen name="SignIn"  />
      <Stack.Screen name="SignInOption"  options={{ headerShown: false }} />
      <Stack.Screen name="LoginWithPhone" />
      <Stack.Screen name="PasswordRecovery" />
      <Stack.Screen name="PasswordResetScreen" />
      <Stack.Screen name="SignUp" />
      {/* <Stack.Screen name="Listings" /> */}
    </Stack>
    </AuthProvider>
  );
}

import { Image } from "react-native";
import { Stack } from "expo-router";
import React, { useContext } from "react";

export default function AuthStackLayout() {
  return (

    <Stack  initialRouteName="SplashScreen"
    screenOptions={
      { headerShown: true ,
        headerStyle: { backgroundColor: 'white' },
        headerTitle: '',
         headerRight: () => (
     <Image
               source={require('../../assets/images/Star 8.png')}
               style={{ width: 46,height: 44,marginRight: 10 }}
             />
    ), }
      
    }>
      <Stack.Screen name="SignIn"  />
      <Stack.Screen name="SignInOption"  options={{ headerShown: false }} />
      <Stack.Screen name="SplashScreen"  options={{ headerShown: false }} />
      <Stack.Screen name="LoginWithPhone" />
      <Stack.Screen name="Email" />
      <Stack.Screen name="VerifyOTP" />
      <Stack.Screen name="PasswordReset" />
      <Stack.Screen name="SignUp" />
      
    </Stack>
  );
}

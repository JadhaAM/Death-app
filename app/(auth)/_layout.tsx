import { Image } from "react-native";
import { Stack } from "expo-router";
import React, { useContext } from "react";

export default function AuthStackLayout() {
  return (

    <Stack 
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
      <Stack.Screen name="SupperAdminSignIn"  />
      <Stack.Screen name="SignInOption"  options={{ headerShown: false }} />
      <Stack.Screen name="LoginWithPhone" />
      <Stack.Screen name="AdminOptions" options={{ headerShown: false }} />
      <Stack.Screen name="MainAdminOptions" options={{ headerShown: false }} />
      <Stack.Screen name="ChooseLanguage" />
      <Stack.Screen name="ChoosePlan" />
      <Stack.Screen name="Email" />
      <Stack.Screen name="EmailSecound" />
      <Stack.Screen name="VerifyOTP" />
      <Stack.Screen name="PartnerVerifyOTP" />
      <Stack.Screen name="PasswordReset" />
      <Stack.Screen name="PartnerPasswordReset" />
      <Stack.Screen name="SignUp" />
      <Stack.Screen name="Survey" options={{ headerShown: false }}/>
      
    </Stack>
  );
}

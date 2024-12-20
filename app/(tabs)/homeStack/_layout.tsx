import { Stack } from "expo-router";
import React from "react";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="MoreInfo" />
      {/* <Stack.Screen name="Listings" /> */}
    </Stack>
  );
}

import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProvider, { AuthContext } from "./AuthContext/AuthContext";
import { WebSocketProvider } from './AuthContext/WebSocketService';
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <WebSocketProvider>
      <AppContent />
      </WebSocketProvider>
    </AuthProvider>

  );
}

function AppContent() {
  const { token, setToken } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const [isTokenFetched, setIsTokenFetched] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const fetchUserToken = async () => {

      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }

      setIsTokenFetched(true);
    };

    fetchUserToken();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!isTokenFetched || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={token === null ? "index" : "(tabs)"}>
        <Stack.Screen name="index"  options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Listings" options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
        <Stack.Screen name="NotificationScreen" options={{ headerShown: false }} />
        <Stack.Screen name="MoreInfo" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

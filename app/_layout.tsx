import React, { useContext, useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthProvider, { AuthContext } from "./AuthContext/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, View, Linking } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { token, setToken } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const [isTokenFetched, setIsTokenFetched] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state for token processing

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const processToken = async (url: string | null) => {
      if (!url) {
        console.log("No URL provided for processing.");
        setLoading(false);  // Stop loading if no URL
        return;
      }

      console.log("Processing URL:", url);

      // Parse the query parameters from the URL
      const parsedURL = new URL(url);
      console.log("Processing URL:", parsedURL);
      const token = parsedURL.searchParams.get("token");
      console.log("Query Params:", token);
      if (token) {
        console.log("Token found in URL:", token);

        // Decode token, store it, and navigate
        try {
          await AsyncStorage.setItem("authToken", token);
          setToken(token);
          console.log("User authenticated, navigating to home.");
          router.push("/(tabs)/home");
        } catch (error) {
          console.error("Error processing token:", error);
        }
      } else {
        console.log("No token found in URL.");
      }

      setLoading(false);  // Stop loading once token is processed
    };

    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log("Initial URL:", initialUrl);

      // Process the initial URL only if it includes a token
      if (initialUrl && initialUrl.includes("token")) {
        await processToken(initialUrl);
      } else {
        setLoading(false);  // Stop loading if no URL or token
      }
    };

    const handleRedirectURL = (event: { url: string }) => {
      const url = event.url;
      console.log("Redirected URL:", url);
      processToken(url);
    };

    // Handle the initial URL on app launch
    handleInitialURL();

    // Listen for redirected URLs
    const subscription = Linking.addEventListener("url", handleRedirectURL);

    // Clean up the listener when the component unmounts
    return () => subscription.remove();
  }, []);

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
      setLoading(false);  // Stop loading once the token fetch is complete
    };

    fetchUserToken();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loading || !isTokenFetched || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={token === null ? "(tabs)" : "index"}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Listings" options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
        <Stack.Screen name="NotificationScreen" options={{ headerShown: false }} />
        <Stack.Screen name="MoreInfo" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="AdminChat" options={{ headerShown: false }} />
        <Stack.Screen name="ViewGallary" options={{ headerShown: false }} />
        <Stack.Screen name="PartnerForm" options={{ headerShown: false }} />
        <Stack.Screen name="EditBussnesses" options={{ headerShown: false }} />
        <Stack.Screen name="AddBussnesses" options={{ headerShown: false }} />
        <Stack.Screen name="ContactLog" options={{ headerShown: false }} />
        <Stack.Screen name="RecentBusinessLog" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

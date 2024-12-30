import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        position: "absolute",
        backgroundColor: "white", // White background
        elevation: 0, // Removes shadow on Android
        borderTopWidth: 0,
        height: 50, // Removes top border
      },
      default: {
        backgroundColor: "white", // White background
        elevation: 0, // Removes shadow on Android
        borderTopWidth: 0, // Removes top border
        height: 50,
      },
    }),
  }}
>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
          tabBarActiveTintColor: "#3E69FE",
        }}
      />
      <Tabs.Screen
        name="Chat"
        options={{
          title: "Chat",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
          ),
          tabBarActiveTintColor: "#3E69FE",
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Octicons name="heart" size={24} color={color} />
          ),
          tabBarActiveTintColor: "#CC2B52",
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <Octicons name="person" size={24} color={color} />
          ),
          tabBarActiveTintColor: "#CC2B52",
        }}
      />
    </Tabs>
  );
}

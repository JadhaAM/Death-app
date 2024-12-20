import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Searchbar from "@/components/TopBar/Searchbar";
import { Image } from "expo-image";
import TopResultsList from "@/components/TopResultsList/TopResultsList";
import { SafeAreaView } from "react-native-safe-area-context";
import TopRated from "@/components/TopRated/TopRated";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";

const Listings = () => {
  const { title, list } = useLocalSearchParams();

  const parsedList = list ? JSON.parse(list) : [];

  console.log("PPARSED DATA IN LISTINGS-------> ", title, parsedList);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <Header title={title} />
          {/* Top Section */}
          <View style={styles.imageContainer}>
            <Searchbar />
            <Image
              source={"https://img.icons8.com/ios/50/sorting-options--v1.png"}
              style={{ height: 30, width: 30 }}
            />
          </View>

          <TopRated title={`Top Rated ${title}`} items={parsedList} />

          {/* Top Attorneys */}
          <TopResultsList title={title} items={parsedList} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Listings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 20,
    marginTop: 20,
  },
});

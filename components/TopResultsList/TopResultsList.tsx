import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";

const TopResultsList = ({ title, items }) => {
  const router = useRouter();

  const handlePress = (item) => {
    router.push({
      pathname: "/MoreInfo",
      params: {
        title: title,
        category: item.category,
        id: item._id,
        name: item.businessName,
        fees: item.fees,
        years: item.fees,
        reviews: item.reviews,
        clients: item.clients,
        image: item.businessImage,
        phoneNumber: item.phoneNumber,
        priceStartsFrom: JSON.stringify(item.priceStartsFrom),
        headstoneImage: JSON.stringify(item.headstoneImage),
        rating: item.rating,
        location: item.address || "",
        desc: item.description || "",
        businessImages: JSON.stringify(item.businessImages), // Pass as JSON string
        headstoneNames: JSON.stringify(item.headstoneNames),
      },
    });
  };

  const ListItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => handlePress(item)}
        activeOpacity={0.8} // Added activeOpacity for better feedback
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri: item.headstoneImage[0] || item.businessImages[0],
            }}
            style={styles.itemImage}
          />
          <View style={styles.rightContainer}>
            <View style={styles.rightInnerContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.businessName}</Text>
                {(item.designation || item.description || item.address) && (
                  <Text style={styles.designation}>
                    {item.designation || item.description || item.address}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.rightCornerContainer}>
              <View style={styles.ratingItem}>
                <AntDesign name="star" size={12} color="#FFD700" />
                <Text style={{ marginLeft: 5 }}>{item.rating}</Text>
              </View>
              <View style={styles.rightArrowButton}>
                <TouchableOpacity>
                  <AntDesign name="arrowright" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.seeAllBtnContainer}>
          {/* <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={{ color: "#fff" }}>see all</Text>
            <AntDesign name="right" size={12} color="white" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Flatlist of items */}
      <FlatList
        data={items}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item._id.toString()} // Changed to use _id for unique keys
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 20,
          paddingTop: 20,
          gap: 10,
        }}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No items available.</Text> // Handle empty data case
        }
      />
    </View>
  );
};

export default TopResultsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 10,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    width: "70%",
  },
  seeAllBtnContainer: {
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  seeAllBtn: {
    backgroundColor: "#3E69FE",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    gap: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  listItemContainer: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    elevation: 3,
    height: 100,
  },
  itemImage: {
    height: 80,
    width: 80,
    borderRadius: 28,
    marginLeft: 5,
  },
  rightContainer: {
    marginLeft: 10,
    flex: 1,
    height: "100%",
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightCornerContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E1F2E",
  },
  designation: {
    fontSize: 12,
    color: "#9C9C9C",
  },
  rightInnerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  availability: {
    fontSize: 10,
    color: "#333333",
  },
  rightArrowButton: {
    backgroundColor: "#1E1F2E",
    borderRadius: 5,
    padding: 5,
    elevation: 5,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginTop: 20,
  },
});

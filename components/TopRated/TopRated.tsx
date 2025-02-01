import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation, useRouter } from "expo-router";

const TopRated = ({ title, items }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [topRatedList, setTopRatedList] = useState([]);

  useEffect(() => {
   
    if (items?.length > 0) {
      const sortedItems = [...items]
        .sort((a, b) => b.rating - a.rating || items.indexOf(a) - items.indexOf(b))
        .slice(0, 3); 

      setTopRatedList(sortedItems);
    }
  }, [items]);

  const TopRatedItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.topRatedItem}
        onPress={() => {
          router.push({
            pathname: "/MoreInfo",
            params: {
              title: title,
              category: item.category,
              id: item._id,
              name: item.businessName,
              fees: item.fees,
              years: item.fees,
              clients: item.clients,
              image: item.businessImage,
              phoneNumber: item.phoneNumber,
              priceStartsFrom: JSON.stringify(item.priceStartsFrom),
              rating: item.rating,
              location: item.address || "",
              desc: item.description || "",
              headstoneImage: JSON.stringify(item.headstoneImage),
              businessImages: JSON.stringify(item.businessImages), // Pass as JSON string
              headstoneNames: JSON.stringify(item.headstoneNames),
            },
          });
        }}
      >
        <Image 
          source={{
            uri: item.headstoneImage[0] || item.businessImages[0],
          }} 
          style={styles.itemImg} 
          contentFit="cover" 
        />
        <Text style={styles.itemTitle}>{item.businessName}</Text>
        <Text style={styles.itemSubtitle}>{item.open}</Text>
        <View style={styles.ratingsContainer}>
          <Octicons name="star-fill" size={16} color="#FFD33C" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.topRatedList}>
        {topRatedList.map((item, index) => (
          <TopRatedItem key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default TopRated;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
  },
  topRatedList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topRatedItem: {
    width: "32%",
    backgroundColor: "#3E69FE",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 120,
    marginTop: 10,
    borderRadius: 30,
    position: "relative",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#fff",
  },
  itemImg: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  ratingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
  },
  rating: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

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
    setTopRatedList(items);
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
              name: item.name,
              image: item.image,
              rating: item.rating,
              location: item.location || "",
              desc: item.desc || "",
            },
          });
        }}
      >
        <Image source={item.image} style={styles.itemImg} contentFit="cover" />
        <Text style={styles.itemTitle}>{item.name}</Text>
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
        {topRatedList?.length > 0 &&
          topRatedList?.map((item, index) => (
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

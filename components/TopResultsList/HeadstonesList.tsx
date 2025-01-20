import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const HeadstonesList = ({ title, items }) => {
  const router = useRouter();
  console.log("items",items);
  
  const windowWidth = Dimensions.get("window").width;

  const handlePress = (item) => {
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          { width: windowWidth / 2 - 20 }, // Responsive two-column layout
        ]}
        onPress={() => handlePress(item)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.priceRange}>Single: {item.priceRange}</Text>
        <Text style={styles.comparison}>Comparison: {item.comparison}</Text>
        <TouchableOpacity style={styles.quoteButton}>
          <Text style={styles.quoteButtonText}>REQUEST A QUOTE</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
       
      />
    </View>
  );
};

export default HeadstonesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  priceRange: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  comparison: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  quoteButton: {
    backgroundColor: "#3E69FE",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  quoteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});

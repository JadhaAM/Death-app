import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import funeralHomeIcon from "../../assets/icons/funeralHome.png";
import cemeteryIcon from "../../assets/icons/cemeteryIcon.png";
import headstoneIcon from "../../assets/icons/headstoneIcon.png";
import attorneyIcon from "../../assets/icons/attorneyIcon.png";
// import memorialConsultingIcon from "../../assets/icons/memorialConsultingIcon.png";
import insuranceIcon from "../../assets/icons/insuranceIcon.png";
import { useNavigation, useRouter } from "expo-router";

const serviceListings = {
  "Funeral Homes": [
    {
      name: "Funeral Home 1",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://plus.unsplash.com/premium_photo-1715110520532-7164d61e829e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Funeral Home 2",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://plus.unsplash.com/premium_photo-1713985789550-c3988a65f4c8?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Funeral Home 3",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://plus.unsplash.com/premium_photo-1715110513130-5d19c8688c7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  Cemeteries: [
    {
      name: "Sinai Chapels",
      rating: 4.5,
      reviews: 100,
      desc: "114-03 Queens Boulevard Forest Hills, New York, 11375",
      image:
        "https://images.unsplash.com/photo-1680821488808-d1396c0ebfca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Gutterman's - Rockville Centre",
      rating: 4.5,
      reviews: 100,
      designation: "175 N. Long Beach Road Rockville Centre, New York, 11570",
      image:
        "https://images.unsplash.com/photo-1680821489653-0654365236d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
    },
    {
      name: "Beth David Cemetery",
      rating: 4.5,
      reviews: 100,
      designation: "300 Elmont Rd Elmont, New York, 11003",
      image:
        "https://images.unsplash.com/photo-1680821488396-9c89641be355?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D",
    },
  ],
  Headstones: [
    {
      name: "Headstone 1",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://www.thememorialmanllc.com/cdn/shop/products/272775498_4829356283796974_7563527253474323992_n.jpg?v=1644153444",
    },
    {
      name: "Headstone 2",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhpujCunIJ5KOanw8WbgVSqXdNN2wLHLXqWw&s",
    },
    {
      name: "Headstone 3",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB2ofVdSHabtpsXmtSzb6oWvtXzoLNOgUdCg&s",
    },
  ],
  Attorneys: [
    {
      name: "John Doe",
      rating: 4.5,
      reviews: 100,
      designation: "Criminal Lawyer",
      availability: "10:00 AM - 6:00 PM",
      fees: "$100",
      image:
        "https://images.unsplash.com/photo-1576078855245-301a0bf949cb?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jane Doe",
      rating: 4.5,
      reviews: 100,
      designation: "Senior Attorney",
      availability: "10:00 AM - 6:00 PM",
      fees: "$100",
      image:
        "https://images.unsplash.com/photo-1642911353098-42efaae7f6d4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jake Doe",
      rating: 4.5,
      reviews: 100,
      designation: "Junior Attorney",
      availability: "10:00 AM - 6:00 PM",
      fees: "$100",
      image:
        "https://images.unsplash.com/photo-1662104935762-707db0439ecd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  "Memorial Consulting": [
    {
      name: "Memorial Consultant 1",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://plus.unsplash.com/premium_photo-1667222138722-8c511117a798?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Memorial Consultant 2",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://plus.unsplash.com/premium_photo-1667222138773-fdac78693a79?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Memorial Consultant 3",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://images.unsplash.com/photo-1585846328761-acbf5a12beea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  Insurance: [
    {
      name: "Insurance 1",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://images.unsplash.com/photo-1585846328761-acbf5a12beea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Insurance 2",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://images.unsplash.com/photo-1637763723578-79a4ca9225f7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Insurance 3",
      rating: 4.5,
      reviews: 100,
      location: "1234 Cemetery Lane",
      image:
        "https://images.unsplash.com/photo-1722235625805-ea64de92983d?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
};

const Services = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const servicesList = [
    {
      name: "Funeral Homes",
      icon: funeralHomeIcon,
    },
    {
      name: "Cemeteries",
      icon: cemeteryIcon,
    },
    {
      name: "Headstones",
      icon: headstoneIcon,
    },
    {
      name: "Attorneys",
      icon: attorneyIcon,
    },
    {
      name: "Memorial Consulting",
      icon: insuranceIcon,
    },
    {
      name: "Insurance",
      icon: insuranceIcon,
    },
  ];

  const ServiceItem = ({
    title,
    icon,
  }: {
    title: keyof typeof serviceListings;
    icon: any;
  }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          router.push({
            pathname: "/Listings",
            params: {
              title: title,
              list: JSON.stringify(serviceListings[title]),
            },
          })
        }
      >
        <Image source={icon} style={{ height: 25, width: 25 }} />
        <Text style={styles.itemName}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      <View style={styles.serviceListContainer}>
        {servicesList.map((service, index) => (
          <ServiceItem key={index} title={service.name} icon={service.icon} />
        ))}
      </View>
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  itemContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#3E69FE",
    width: "30%",
    gap: 5,
    height: 80,
  },
  serviceListContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  itemName: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 18,
  },
});

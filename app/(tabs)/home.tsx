import { Image, StyleSheet, Platform, ScrollView, Text, View } from "react-native";
import TopBar from "@/components/TopBar/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import Services from "@/components/Services/Services";
import TopResultsList from "@/components/TopResultsList/TopResultsList";
import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { AuthContext } from "../AuthContext/AuthContext";

const home =()=>{ 
  const { isSurvyDone,setSurvyDone} = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(false);  

  useEffect(() => {  
    // Set mounted state to true when the component is mounted  
    setIsMounted(true);  
  }, []);  

  useEffect(() => {  
    // Navigate only if the component is mounted  
    if (isMounted) {  
      if (isSurvyDone) {  
        router.push("/(auth)/Survey"); 
      }  
    }  
  }, [isMounted, isSurvyDone, router]); 
      
 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View>
          {/* Top Section */}
          <TopBar />

          {/* Services */}
          <Services />

          {/* Top Attorneys */}
          <TopResultsList
            title="Top Attorneys"
            items={[
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
              
            ]}
          />

           <View style={styles.iconContainer}>  
               <Text style={styles.title}>
               Top Memorial Consulting
               </Text>
                  <Image
                    source={require('../../assets/images/memorial1.png')} 
                    style={styles.image} 
                  />
                </View>

                <TopResultsList
            title="Top Headstones"
            items={[
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
             
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconContainer: {
    // flex:1,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  image: {
    width: 335.61,
    height: 335.61,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

export default  home;
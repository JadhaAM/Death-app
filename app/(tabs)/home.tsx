import { Image, StyleSheet, Platform, ScrollView, View } from "react-native";
import TopBar from "@/components/TopBar/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import Services from "@/components/Services/Services";
import TopResultsList from "@/components/TopResultsList/TopResultsList";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

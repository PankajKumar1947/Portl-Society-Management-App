import React from "react";
import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme } from "../../../../constants";
import { ScreenHeader } from "../../../../components/ui/screen-header";
import { Button } from "../../../../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";

const AMENITY_DETAILS = {
  "1": {
    name: "Club House",
    category: "Indoor",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    capacity: "50 People",
    timings: "06:00 AM – 10:00 PM",
    rules: [
      "No loud music after 10 PM",
      "Keep the place clean",
      "No smoking or alcohol",
    ],
  },
  "2": {
    name: "Gym",
    category: "Indoor",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    capacity: "20 People",
    timings: "05:00 AM – 11:00 PM",
    rules: [
      "Wipe down equipment after use",
      "Wear appropriate athletic footwear",
      "Limit cardio machines to 30 mins",
    ],
  },
  "3": {
    name: "Swimming Pool",
    category: "Outdoor",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
    capacity: "30 People",
    timings: "06:00 AM – 09:00 PM",
    rules: [
      "Shower before entering the pool",
      "Proper swimwear is mandatory",
      "No glass bottles near the pool area",
    ],
  },
};

export default function AmenityDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const details = AMENITY_DETAILS[id as keyof typeof AMENITY_DETAILS] || AMENITY_DETAILS["1"];

  const handleBook = () => {
    router.push({
      pathname: "/(resident)/amenities/[id]/book",
      params: { id, name: details.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Amenity Details" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: details.imageUrl }} style={styles.headerImage} />

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.category}>{details.category}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capacity</Text>
            <Text style={styles.sectionText}>{details.capacity}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timings</Text>
            <Text style={styles.sectionText}>{details.timings}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rules</Text>
            {details.rules.map((rule, index) => (
              <Text key={index} style={styles.ruleItem}>
                • {rule}
              </Text>
            ))}
          </View>

          <Button onPress={handleBook} style={styles.bookButton}>
            Book Now
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 112, // Clearance for absolute bottom navigation bar
  },
  headerImage: {
    width: "100%",
    height: 240,
  },
  detailsContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  ruleItem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  bookButton: {
    height: 52,
    marginTop: theme.spacing.lg,
  },
});

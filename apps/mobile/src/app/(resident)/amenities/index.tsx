import React, { useState } from "react";
import { View, FlatList, StyleSheet, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Amenity {
  id: string;
  name: string;
  category: "indoor" | "outdoor";
  imageUrl: string;
  status: "available" | "booked";
}

const MOCK_AMENITIES: Amenity[] = [
  {
    id: "1",
    name: "Club House",
    category: "indoor",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "2",
    name: "Gym",
    category: "indoor",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    status: "available",
  },
  {
    id: "3",
    name: "Swimming Pool",
    category: "outdoor",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
    status: "booked",
  },
];

const FILTER_TABS_EXPLORE = [
  { id: "all", label: "All" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
];

export default function AmenitiesScreen() {
  const router = useRouter();
  const [activeExploreFilter, setActiveExploreFilter] = useState("all");

  const filteredAmenities = MOCK_AMENITIES.filter(
    (item) => activeExploreFilter === "all" || item.category === activeExploreFilter
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Amenities"
        showBack={true}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Amenities.Bookings.Index)}
            icon={<Ionicons name="time-outline" size={24} color={theme.colors.text} />}
            variant="ghost"
          />
        }
      />

      <FilterTabs
        tabs={FILTER_TABS_EXPLORE}
        activeTab={activeExploreFilter}
        onTabChange={setActiveExploreFilter}
        style={styles.filterTabs}
      />

      <FlatList
        data={filteredAmenities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.card}
            onPress={() => router.push(Routes.Amenities.Details(item.id))}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.footerRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Badge variant={item.status === "available" ? "success" : "warning"}>
                {item.status === "available" ? "Available" : "Booked"}
              </Badge>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterTabs: {
    marginBottom: theme.spacing.sm,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 112,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  separator: {
    height: theme.spacing.md,
  },
});

import React, { useState } from "react";
import { View, FlatList, StyleSheet, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeAreaView } from "react-native-safe-area-context";

interface Booking {
  id: string;
  amenityName: string;
  imageUrl: string;
  date: string;
  timeSlot: string;
  status: "upcoming" | "past" | "cancelled";
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK1",
    amenityName: "Club House",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    date: "18 May 2024",
    timeSlot: "12:00 PM – 03:00 PM",
    status: "upcoming",
  },
  {
    id: "BK2",
    amenityName: "Gym",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    date: "10 May 2024",
    timeSlot: "08:00 AM – 09:00 AM",
    status: "past",
  },
];

const FILTER_TABS_BOOKINGS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

export default function MyBookingsScreen() {
  const router = useRouter();
  const [activeBookingFilter, setActiveBookingFilter] = useState("upcoming");

  const filteredBookings = MOCK_BOOKINGS.filter(
    (item) => item.status === activeBookingFilter
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Bookings" showBack={true} />

      <FilterTabs
        tabs={FILTER_TABS_BOOKINGS}
        activeTab={activeBookingFilter}
        onTabChange={setActiveBookingFilter}
        style={styles.filterTabs}
      />

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.bookingCard}
            onPress={() => router.push(Routes.Amenities.Bookings.Details(
              item.id === "BK1" ? "1" : "2",
              item.amenityName,
              item.date,
              item.timeSlot,
              item.status,
              item.id === "BK1" ? "BK12345678" : "BK87654321"
            ))}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.bookingImage} />
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingName}>{item.amenityName}</Text>
              <Text style={styles.bookingDetails}>{item.date}</Text>
              <Text style={styles.bookingDetails}>{item.timeSlot}</Text>
            </View>
            <Badge variant={item.status === "upcoming" ? "primary" : "secondary"}>
              {item.status}
            </Badge>
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
    paddingBottom: 40,
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.md,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    gap: 2,
  },
  bookingName: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  bookingDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.md,
  },
});

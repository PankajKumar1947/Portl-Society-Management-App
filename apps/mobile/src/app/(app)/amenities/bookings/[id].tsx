import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Divider } from "@/components/ui/divider";
import { SafeAreaView } from "react-native-safe-area-context";

const AMENITY_IMAGES = {
  "1": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  "2": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
  "3": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
};

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { id, name, date, time, status, price = "₹500", bookingId = "BK12345678" } = useLocalSearchParams<{
    id: string;
    name: string;
    date: string;
    time: string;
    status: string;
    price: string;
    bookingId: string;
  }>();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const imageUrl = AMENITY_IMAGES[id as keyof typeof AMENITY_IMAGES] || AMENITY_IMAGES["1"];

  const handleCancelBooking = () => {
    setCancelModalVisible(false);
    router.replace(Routes.Amenities.Bookings.Index);
  };

  const isUpcoming = status === "upcoming" || !status;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Booking Details" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: imageUrl }} style={styles.headerImage} />

        <View style={styles.content}>
          <Text style={styles.title}>{name || "Club House"}</Text>
          <Text style={styles.statusText}>Status: {status || "Confirmed"}</Text>

          <Card variant="flat" style={styles.detailsCard}>
            <InfoRow icon="calendar-outline" label="Date" value={date || "18 May 2024"} />
            <Divider spacing={theme.spacing.sm} />
            <InfoRow icon="time-outline" label="Time Slot" value={time || "12:00 PM – 03:00 PM"} />
            <Divider spacing={theme.spacing.sm} />
            <InfoRow icon="home-outline" label="Flat" value="A-1203 • Sunita" />
            <Divider spacing={theme.spacing.sm} />
            <InfoRow icon="wallet-outline" label="Amount Paid" value={price} />
            <Divider spacing={theme.spacing.sm} />
            <InfoRow icon="barcode-outline" label="Booking ID" value={bookingId} />
          </Card>

          {isUpcoming && (
            <Button
              variant="outline"
              onPress={() => setCancelModalVisible(true)}
              style={styles.cancelButton}
              textStyle={{ color: theme.colors.danger }}
            >
              Cancel Booking
            </Button>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        cancelLabel="No, Keep"
        onConfirm={handleCancelBooking}
        confirmVariant="danger"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  statusText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.xs,
    textTransform: "capitalize",
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  cancelButton: {
    height: 52,
    borderColor: theme.colors.danger,
    marginTop: theme.spacing.lg,
  },
});

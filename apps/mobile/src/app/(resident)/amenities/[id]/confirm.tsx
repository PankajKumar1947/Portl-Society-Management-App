import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";

const AMENITY_IMAGES = {
  "1": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  "2": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
  "3": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
};

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { id, name, date, time } = useLocalSearchParams<{
    id: string;
    name: string;
    date: string;
    time: string;
  }>();

  const imageUrl = AMENITY_IMAGES[id as keyof typeof AMENITY_IMAGES] || AMENITY_IMAGES["1"];

  const handleFinish = () => {
    router.replace("/(resident)/amenities/bookings");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {/* Success Checkmark Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={32} color={theme.colors.surface} />
          </View>
          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your booking has been confirmed.</Text>
        </View>

        {/* Confirmation Details Card */}
        <Card variant="flat" style={styles.detailsCard}>
          <View style={styles.amenityRow}>
            <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
            <View style={styles.amenityText}>
              <Text style={styles.amenityName}>{name}</Text>
              <Text style={styles.dateText}>{date}</Text>
              <Text style={styles.timeText}>{time}</Text>
              <Text style={styles.flatText}>A-1203 • Sunita</Text>
              <Text style={styles.priceValue}>₹500</Text>
              <Text style={styles.bookingId}>Booking ID: BK12345678</Text>
            </View>
          </View>
        </Card>

        <Button onPress={handleFinish} style={styles.finishButton}>
          View My Bookings
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xxl,
  },
  successHeader: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  checkmarkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    width: "100%",
    padding: theme.spacing.lg,
  },
  amenityRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
  },
  amenityText: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  amenityName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  timeText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  flatText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 6,
  },
  bookingId: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  finishButton: {
    height: 52,
    width: "100%",
    marginTop: theme.spacing.lg,
  },
});

import React from "react";
import { View, StyleSheet, ScrollView, Image, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetAmenityDetail, useAccessControl } from "@repo/operations";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@/components/ui/icon-button";
import { Card } from "@/components/ui/card";
import { ImageGallery } from "@/components/ui/image-gallery";
import { MediaData, AclResource } from "@repo/schema";
import LoadingScreen from "@/components/layout/loading-screen";
import NotFoundScreen from "@/components/layout/not-found-screen";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AmenityDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: amenity, isLoading } = useGetAmenityDetail(id ?? "", { enabled: !!id });

  const { canUpdate, canCreate } = useAccessControl(AclResource.AMENITIES);

  if (isLoading)
    return <LoadingScreen title="Fetching Amenity Details" onBack={() => router.back()} />

  if (!amenity)
    return <NotFoundScreen title="Amenity not found" message="No amenity found with this ID." onBack={() => router.back()} />

  const handleBook = () => {
    router.push(Routes.Amenities.Book(amenity.amenityId, amenity.name));
  };

  const thumbnailUrl = amenity.thumbnailFile?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop";
  const galleryImages = amenity.galleryFiles?.map((m: MediaData) => ({ uri: m.url, id: m.mediaId })) || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Amenity Details"
        onBack={() => router.back()}
        rightElement={
          canUpdate ? (
            <IconButton
              onPress={() => router.push(Routes.Amenities.Edit(amenity.amenityId))}
              icon={<Ionicons name="pencil-outline" size={22} color={theme.colors.text} />}
              variant="ghost"
              size="md"
            />
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: thumbnailUrl }} style={styles.headerImage} />

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{amenity.name}</Text>
          <Text style={styles.category}>{amenity.category.replace("_", " ")} • {amenity.type}</Text>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={theme.colors.primaryDark} />
              <View>
                <Text style={styles.infoLabel}>Capacity</Text>
                <Text style={styles.infoVal}>{amenity.capacity} People</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primaryDark} />
              <View>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoVal}>
                  {amenity.floorNumber ? `${amenity.floorNumber}, ` : ""}
                  {amenity.location || "Society Grounds"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {amenity.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.sectionText}>{amenity.description}</Text>
            </View>
          )}

          {amenity.rules && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rules & Guidelines</Text>
              <Text style={styles.sectionText}>{amenity.rules}</Text>
            </View>
          )}

          {galleryImages.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <ImageGallery images={galleryImages} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Operating Hours</Text>
            <Card variant="flat" style={styles.timingsCard}>
              {amenity.openHours.map((hour, idx) => (
                <View key={idx} style={styles.timingRow}>
                  <Text style={styles.dayText}>{DAYS_OF_WEEK[hour.dayOfWeek]}</Text>
                  <Text style={styles.timeText}>
                    {hour.isClosed ? "Closed" : `${hour.openTime} - ${hour.closeTime}`}
                  </Text>
                </View>
              ))}
            </Card>
          </View>

          {amenity.bookingRequired && canCreate && (
            <Button onPress={handleBook} style={styles.bookButton}>
              Book Now
            </Button>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.danger,
  },
  scrollContent: {
    paddingBottom: 112,
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
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  infoGrid: {
    flexDirection: "row",
    gap: theme.spacing.xl,
  },
  infoItem: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    fontWeight: theme.fontWeights.semibold,
  },
  infoVal: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.medium,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  timingsCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  timingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  dayText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  timeText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  bookButton: {
    height: 52,
    marginTop: theme.spacing.lg,
  },
});

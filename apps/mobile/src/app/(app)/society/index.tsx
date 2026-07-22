import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import InfoRow from "@/components/ui/info-row";
import Badge from "@/components/ui/badge";
import { useGetMySociety } from "@repo/operations";

export default function SocietyDetailsScreen() {
  const router = useRouter();
  const { data: society, isLoading, error } = useGetMySociety();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="My Society" onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !society) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="My Society" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
          <Text style={styles.errorText}>Failed to load society details</Text>
          <Button variant="outline" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const societyTypeLabel =
    society.societyType?.replace(/_/g, " ") || "N/A";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="My Society"
        onBack={() => router.replace(Routes.App)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Society.Edit)}
            icon={<Ionicons name="create-outline" size={22} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner / Header Card */}
        <Card variant="flat" style={styles.headerCard}>
          <View style={styles.iconWrapper}>
            <Ionicons name="business-outline" size={36} color={theme.colors.primaryDark} />
          </View>
          <Text style={styles.societyName}>{society.societyName}</Text>
          <Badge variant="primary" style={styles.typeBadge}>
            {societyTypeLabel}
          </Badge>
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Joining Code: </Text>
            <Text style={styles.codeValue}>{society.societyCode}</Text>
          </View>
        </Card>

        {/* Contact Info Card */}
        <Card variant="flat" style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Primary Contact</Text>
          <InfoRow
            icon="person-outline"
            label="Contact Name"
            value={society.primaryContactName}
          />
          <InfoRow
            icon="call-outline"
            label="Phone Number"
            value={society.primaryContactNumber}
          />
          <InfoRow
            icon="mail-outline"
            label="Email Address"
            value={society.primaryContactEmail}
          />
        </Card>

        {/* Additional Info Card */}
        <Card variant="flat" style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          {society.establishedYear && (
            <InfoRow
              icon="calendar-outline"
              label="Established Year"
              value={society.establishedYear.toString()}
            />
          )}
          {society.addressLine && (
            <InfoRow
              icon="location-outline"
              label="Address"
              value={`${society.addressLine}, ${society.city}, ${society.state}, ${society.country} - ${society.pincode}`}
            />
          )}
        </Card>

        {/* Edit Button */}
        <Button
          variant="primary"
          style={styles.editButton}
          onPress={() => router.push(Routes.Society.Edit)}
        >
          Edit Society Details
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  headerCard: {
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  societyName: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  typeBadge: {
    marginBottom: theme.spacing.md,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  codeLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  codeValue: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primaryDark,
  },
  infoCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    marginTop: theme.spacing.sm,
    height: 52,
  },
});

import React from "react";
import { StyleSheet, View, Text, ScrollView, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import InfoRow from "@/components/ui/info-row";
import Button from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import { useAlert } from "@/context/alert-context";

// Temporary Mock Data Lookup
const MOCK_GUARDS: Record<string, any> = {
  grd_1: {
    guardId: "grd_1",
    name: "David Chen",
    email: "david.chen@security.com",
    phoneNumber: "9876543210",
    shiftType: "DAY",
    gateNumber: "Gate 1",
    status: "ACTIVE",
    agencyName: "Swift Security",
    joiningDate: "2025-01-15",
  },
  grd_2: {
    guardId: "grd_2",
    name: "Emma Wilson",
    email: "emma.wilson@security.com",
    phoneNumber: "9876543211",
    shiftType: "NIGHT",
    gateNumber: "Gate 3",
    status: "ACTIVE",
    agencyName: "Swift Security",
    joiningDate: "2025-03-20",
  },
  grd_3: {
    guardId: "grd_3",
    name: "Michael Brown",
    email: "michael.brown@security.com",
    phoneNumber: "9876543212",
    shiftType: "DAY",
    gateNumber: "Gate 2",
    status: "INACTIVE",
    agencyName: "Guardian Force",
    joiningDate: "2024-11-01",
  },
};

export default function GuardDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();

  const guard = MOCK_GUARDS[id || ""] || MOCK_GUARDS.grd_1;

  const handleCall = () => {
    Linking.openURL(`tel:${guard.phoneNumber}`);
  };

  const handleDelete = () => {
    showAlert({
      title: "Remove Security Guard",
      description: `Are you sure you want to remove ${guard.name} from active duty logs?`,
      variant: "warning",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
      onConfirm: () => {
        router.back();
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Guard Profile"
        onBack={() => router.back()}
        rightElement={
          <Ionicons
            name="create-outline"
            size={22}
            color={theme.colors.text}
            onPress={() => router.push(Routes.Guards.Edit(guard.guardId) as any)}
            style={{ marginRight: theme.spacing.sm }}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Profile Section */}
        <View style={styles.avatarSection}>
          <Avatar
            name={guard.name}
            size="xl"
            style={styles.avatar}
          />
          <Text style={styles.userName}>{guard.name}</Text>

          <View style={styles.badgeRow}>
            <Badge variant={guard.status === "ACTIVE" ? "success" : "danger"}>
              {guard.status === "ACTIVE" ? "Active duty" : "Inactive"}
            </Badge>
            <Badge variant="info">
              {guard.shiftType === "DAY" ? "Day shift" : "Night shift"}
            </Badge>
          </View>
        </View>

        {/* Quick Contact Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <Button
            onPress={handleCall}
            variant="outline"
            style={styles.contactButton}
          >
            Call Guard
          </Button>
        </View>

        {/* Assigned Details Section */}
        <Text style={styles.sectionTitle}>Shift & Duty Details</Text>
        <Card style={styles.detailsCard}>
          <InfoRow label="Assigned Gate" value={guard.gateNumber} />
          <InfoRow label="Shift Schedule" value={guard.shiftType === "DAY" ? "08:00 AM - 08:00 PM" : "08:00 PM - 08:00 AM"} />
          <InfoRow label="Security Agency" value={guard.agencyName} />
          <InfoRow label="Joining Date" value={guard.joiningDate} />
        </Card>

        {/* Contact details */}
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <Card style={styles.detailsCard}>
          <InfoRow label="Phone Number" value={guard.phoneNumber} />
          <InfoRow label="Email Address" value={guard.email} />
        </Card>

        {/* Delete Area */}
        <Button
          onPress={handleDelete}
          variant="outline"
          style={styles.deleteButton}
          textStyle={{ color: theme.colors.danger }}
        >
          Remove Guard
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
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  avatar: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  userName: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  contactButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  detailsCard: {
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  deleteButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.border,
  },
});

import React from "react";
import { formatDate } from "@/utils/date";
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
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import { useGetGuardDetail, useDeleteGuard, useAccessControl } from "@repo/operations";
import { AclResource } from "@repo/schema";

export default function GuardDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();

  const { data: guard, isLoading } = useGetGuardDetail(id || "", { enabled: !!id });
  const { mutate: deleteGuardMutation } = useDeleteGuard(id || "");
  const { canUpdate, canDelete } = useAccessControl(AclResource.GUARDS);

  if (isLoading) {
    return <LoadingScreen title="Guard Profile" onBack={() => router.back()} />;
  }

  if (!guard) {
    return <NotFoundScreen title="Guard Profile" message="Guard profile not found" onBack={() => router.back()} />;
  }

  const userDetails = guard.userDetails;
  const guardName = `${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`;

  const handleCall = () => {
    if (userDetails?.phoneNumber) {
      Linking.openURL(`tel:${userDetails.phoneNumber}`);
    }
  };

  const handleDelete = () => {
    showAlert({
      title: "Remove Security Guard",
      description: `Are you sure you want to remove ${guardName} from active duty logs?`,
      variant: "warning",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
      onConfirm: () => {
        deleteGuardMutation(undefined, {
          onSuccess: () => {
            router.back();
          },
        });
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Guard Profile"
        onBack={() => router.back()}
        rightElement={
          canUpdate && (
            <Ionicons
              name="create-outline"
              size={22}
              color={theme.colors.text}
              onPress={() => router.push(Routes.Guards.Edit(guard.guardId))}
              style={{ marginRight: theme.spacing.sm }}
            />
          )
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Profile Section */}
        <View style={styles.avatarSection}>
          <Avatar
            name={guardName}
            size="xl"
            style={styles.avatar}
          />
          <Text style={styles.userName}>{guardName}</Text>

          <View style={styles.badgeRow}>
            <Badge variant={guard.status === "ACTIVE" ? "success" : "danger"}>
              {guard.status === "ACTIVE" ? "Active duty" : "Inactive"}
            </Badge>
            <Badge variant={guard.policeVerificationStatus === "VERIFIED" ? "success" : guard.policeVerificationStatus === "PENDING" ? "warning" : "danger"}>
              {guard.policeVerificationStatus === "VERIFIED" ? "Verified" : guard.policeVerificationStatus === "PENDING" ? "Verification Pending" : "Verification Failed"}
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
          <InfoRow label="Security Agency" value={guard.agencyName || "None"} />
          <InfoRow label="Joining Date" value={formatDate(guard.joiningDate, "short")} />
        </Card>

        {/* Verification & Identification Details */}
        <Text style={styles.sectionTitle}>Verification & Identification</Text>
        <Card style={styles.detailsCard}>
          <InfoRow label="Aadhar Card" value={guard.aadharNumber || "N/A"} />
          <InfoRow label="Emergency Phone" value={guard.emergencyContact || "N/A"} />
          <InfoRow label="Home Address" value={`${guard.streetAddress || ""}, ${guard.city || ""}, ${guard.state || ""}, ${guard.country || ""} - ${guard.zipCode || ""}`} />
        </Card>

        {/* Contact details */}
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <Card style={styles.detailsCard}>
          <InfoRow label="Phone Number" value={userDetails?.phoneNumber || ""} />
          <InfoRow label="Email Address" value={userDetails?.email || ""} />
        </Card>

        {/* Delete Area */}
        {canDelete && (
          <Button
            onPress={handleDelete}
            variant="outline"
            style={styles.deleteButton}
            textStyle={{ color: theme.colors.danger }}
          >
            Remove Guard
          </Button>
        )}
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

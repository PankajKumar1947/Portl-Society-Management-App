import React, { useLayoutEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Alert, Linking, Share, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import InfoRow from "@/components/ui/info-row";
import Button from "@/components/ui/button";
import Avatar from "@/components/ui/avatar";
import { useGetResidentDetail, useDeleteResident } from "@repo/operations";

export default function ResidentDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: resident, isLoading } = useGetResidentDetail(id || "", { enabled: !!id });
  const { mutate: deleteResidentMutation } = useDeleteResident(id || "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Resident Details" onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!resident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Resident Details" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Resident not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${resident.userDetails?.phoneNumber || ""}`);
  };

  const handleEmail = () => {
    if (resident.userDetails?.email) {
      Linking.openURL(`mailto:${resident.userDetails.email}`);
    } else {
      Alert.alert("Not Available", "Email address was not provided for this resident.");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Resident Contact Info:\nName: ${resident.userDetails?.firstName || ""} ${resident.userDetails?.lastName || ""}\nMobile: ${resident.userDetails?.phoneNumber || ""}\nFlat: ${resident.flatNumber}, ${resident.towerId.toUpperCase()}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share contact info");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Resident",
      `Are you sure you want to remove ${resident.userDetails?.firstName || ""} ${resident.userDetails?.lastName || ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            deleteResidentMutation(undefined, {
              onSuccess: () => {
                router.back();
              },
              onError: () => {
                Alert.alert("Error", "Failed to remove resident");
              },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Resident Profile"
        onBack={() => router.back()}
        rightElement={
          <Ionicons
            name="create-outline"
            size={22}
            color={theme.colors.text}
            onPress={() => router.push(Routes.Residents.Edit(resident.residentId) as any)}
            style={styles.headerEditIcon}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View style={styles.profileHeaderCard}>
          <Avatar
            name={`${resident.userDetails?.firstName || ""} ${resident.userDetails?.lastName || ""}`}
            size="lg"
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {resident.userDetails?.firstName || ""} {resident.userDetails?.lastName || ""}
          </Text>
          
          <View style={styles.badgeRow}>
            <Badge variant={resident.residentType === "OWNER" ? "success" : "info"}>
              {resident.residentType.replace("_", " ")}
            </Badge>
            {resident.isPrimary && (
              <Badge variant="warning">
                Primary Contact
              </Badge>
            )}
          </View>

          <View style={styles.commActions}>
            <TouchableOpacity onPress={handleCall} style={styles.commButton}>
              <Ionicons name="call" size={16} color={theme.colors.primaryDark} />
              <Text style={styles.commButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmail} style={styles.commButton}>
              <Ionicons name="mail" size={16} color={theme.colors.primaryDark} />
              <Text style={styles.commButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.commButton}>
              <Ionicons name="share-social" size={16} color={theme.colors.primaryDark} />
              <Text style={styles.commButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Residency Details */}
        <Text style={styles.sectionTitle}>Residency Info</Text>
        <Card style={styles.detailsCard}>
          <InfoRow
            label="Tower"
            value={resident.towerId.toUpperCase().replace("-", " ")}
          />
          <InfoRow
            label="Flat / Apartment"
            value={resident.flatNumber}
          />
          <InfoRow
            label="Move-In Date"
            value={resident.moveInDate}
          />
          <InfoRow
            label="Ownership Status"
            value={resident.ownershipStatus}
          />
          {resident.residentType === "FAMILY_MEMBER" && resident.relationship && (
            <InfoRow
              label="Relationship"
              value={resident.relationship}
            />
          )}
        </Card>

        {/* Contact Details */}
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <Card style={styles.detailsCard}>
          <InfoRow
            label="Mobile Phone"
            value={resident.userDetails?.phoneNumber || ""}
          />
          <InfoRow
            label="Email Address"
            value={resident.userDetails?.email || "Not provided"}
          />
        </Card>

        {/* Vehicle Details */}
        {resident.vehicleType !== "NONE" && (
          <>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <Card style={styles.detailsCard}>
              <InfoRow
                label="Type"
                value={resident.vehicleType === "TWO_WHEELER" ? "2 Wheeler" : "4 Wheeler"}
              />
              {resident.vehicleNumber && (
                <InfoRow
                  label="Plate Number"
                  value={resident.vehicleNumber}
                />
              )}
              {resident.vehicleBrand && (
                <InfoRow
                  label="Make & Model"
                  value={`${resident.vehicleBrand} ${resident.vehicleModel || ""}`}
                />
              )}
              {resident.vehicleColor && (
                <InfoRow
                  label="Color"
                  value={resident.vehicleColor}
                />
              )}
              {resident.parkingSlot && (
                <InfoRow
                  label="Parking Lot Slot"
                  value={resident.parkingSlot}
                />
              )}
            </Card>
          </>
        )}

        {/* Verification Details */}
        {resident.docType !== "NONE" && (
          <>
            <Text style={styles.sectionTitle}>Identity Verification</Text>
            <Card style={styles.detailsCard}>
              <InfoRow
                label="Document Type"
                value={resident.docType}
              />
              {resident.documentNumber && (
                <InfoRow
                  label="Document ID Number"
                  value={resident.documentNumber}
                />
              )}
            </Card>
          </>
        )}

        {/* Danger Zone */}
        <Button
          onPress={handleDelete}
          variant="ghost"
          style={styles.deleteButton}
          textStyle={{ color: theme.colors.danger }}
        >
          Remove Resident
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.medium,
  },
  headerEditIcon: {
    marginRight: theme.spacing.xs,
  },
  profileHeaderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  commActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: theme.spacing.sm,
  },
  commButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.full,
    height: 36,
    gap: theme.spacing.xs,
  },
  commButtonText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  detailsCard: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  deleteButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.danger,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

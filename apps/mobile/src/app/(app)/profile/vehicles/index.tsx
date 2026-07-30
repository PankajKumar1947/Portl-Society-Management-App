import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Routes } from "@/constants";
import { useGetMyVehicles, useDeleteVehicle, useAccessControl } from "@repo/operations";
import { AclResource } from "@repo/schema";
import { useAlert } from "@/context/alert-context";

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  FOUR_WHEELER: "Four Wheeler",
  TWO_WHEELER: "Two Wheeler",
  NONE: "None",
};

export default function VehiclesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { showAlert } = useAlert();
  const { canCreate, canDelete } = useAccessControl(AclResource.VEHICLES);

  const { data: vehicles = [], isLoading, refetch } = useGetMyVehicles();
  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleDelete = (vehicleId: string) => {
    showAlert({
      title: "Remove Vehicle",
      description: "Are you sure you want to remove this vehicle?",
      variant: "warning",
      confirmLabel: "Delete",
      showCancel: true,
      onConfirm: async () => {
        deleteVehicle(vehicleId, {
          onSuccess() {
            refetch();
          },
        });
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Vehicle Details" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Vehicle Details" onBack={() => router.back()} />

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.vehicleId}
        contentContainerStyle={[styles.list, vehicles.length === 0 && styles.center]}
        refreshing={isLoading || isDeleting}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.vehicleCard}
            onPress={() => router.push(Routes.Profile.EditVehicle(item.vehicleId))}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={item.vehicleType === "TWO_WHEELER" ? "bicycle-outline" : "car-sport-outline"}
                size={24}
                color={theme.colors.primaryDark}
              />
            </View>
            <View style={styles.infoWrapper}>
              <Text style={styles.number}>{item.vehicleNumber}</Text>
              <Text style={styles.typeModel}>
                {VEHICLE_TYPE_LABELS[item.vehicleType] || item.vehicleType}
                {item.vehicleBrand || item.vehicleModel
                  ? ` • ${[item.vehicleBrand, item.vehicleModel].filter(Boolean).join(" ")}`
                  : ""}
              </Text>
            </View>
            {canDelete && (
              <IconButton
                icon={<Ionicons name="trash-outline" size={20} color={theme.colors.danger} />}
                onPress={() => handleDelete(item.vehicleId)}
                variant="ghost"
                size="sm"
              />
            )}
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No vehicles registered yet</Text>
          </View>
        }
      />

      {canCreate && (
        <View style={styles.bottomContainer}>
          <Button
            variant="outline"
            style={styles.addButton}
            textStyle={styles.addButtonText}
            onPress={() => router.push(Routes.Profile.AddVehicle)}
          >
            Add Vehicle
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  infoWrapper: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  number: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  typeModel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.sm,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  addButton: {
    width: "100%",
    height: 52,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  addButtonText: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeights.bold,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    fontSize: 15,
  },
});

import React, { useLayoutEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import IconButton from "@/components/ui/icon-button";
import { useGetVehicleDetail, useUpdateVehicle, useDeleteVehicle } from "@repo/operations";
import type { VehicleInput } from "@repo/schema";
import { useAlert } from "@/context/alert-context";
import VehicleForm from "../_components/vehicle-form";

export default function EditVehicleScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();

  const { data: vehicle, isLoading } = useGetVehicleDetail(id);
  const { mutate: updateVehicleMutate, isPending: isUpdating } = useUpdateVehicle();
  const { mutate: deleteVehicleMutate, isPending: isDeleting } = useDeleteVehicle();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleDelete = () => {
    showAlert({
      title: "Remove Vehicle",
      description: "Are you sure you want to remove this vehicle?",
      variant: "warning",
      confirmLabel: "Delete",
      showCancel: true,
      onConfirm: async () => {
        deleteVehicleMutate(id, {
          onSuccess() {
            router.replace(Routes.Profile.Vehicles);
          },
        })
      },
    });
  };

  const onSubmit = (form: VehicleInput) => {
    const formattedNumber = form.vehicleNumber.trim().replace(/\s/g, "").toUpperCase();

    updateVehicleMutate(
      {
        vehicleId: id,
        data: {
          vehicleType: form.vehicleType,
          vehicleNumber: formattedNumber,
          vehicleBrand: form.vehicleBrand?.trim() || "",
          vehicleModel: form.vehicleModel?.trim() || "",
          vehicleColor: "",
          parkingSlot: "",
        },
      },
      {
        onSuccess() {
          router.replace(Routes.Profile.Vehicles);
        }
      }
    );
  };

  if (isLoading || isDeleting) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Vehicle" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const defaultValues: VehicleInput = {
    vehicleType: vehicle?.vehicleType || "FOUR_WHEELER",
    vehicleNumber: vehicle?.vehicleNumber || "",
    vehicleBrand: vehicle?.vehicleBrand || "",
    vehicleModel: vehicle?.vehicleModel || "",
    vehicleColor: vehicle?.vehicleColor || "",
    parkingSlot: vehicle?.parkingSlot || "",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Edit Vehicle"
        onBack={() => router.back()}
        rightElement={
          <IconButton
            icon={<Ionicons name="trash-outline" size={24} color={theme.colors.danger} />}
            onPress={handleDelete}
            variant="ghost"
            size="md"
            disabled={isDeleting}
          />
        }
      />
      <VehicleForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        submitText="Save Changes"
        isPending={isUpdating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { useGetMyVehicles, useAddVehicle } from "@repo/operations";
import { useAlert } from "@/context/alert-context";
import type { VehicleInput } from "@repo/schema";
import VehicleForm from "./_components/vehicle-form";

export default function AddVehicleScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { showAlert } = useAlert();

  const { data: vehicles = [], isLoading } = useGetMyVehicles();
  const { mutate: addVehicle, isPending: isSaving } = useAddVehicle();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const onSubmit = async (form: VehicleInput) => {
    const formattedNumber = form.vehicleNumber.trim().replace(/\s/g, "").toUpperCase();

    // Check if vehicle number already exists
    const exists = vehicles.some(
      (v) => v.vehicleNumber.trim().replace(/\s/g, "").toUpperCase() === formattedNumber
    );

    if (exists) {
      showAlert({
        title: "Duplicate Vehicle",
        description: "A vehicle with this plate number is already registered.",
        variant: "warning",
      });
      return;
    }

    addVehicle({
      vehicleType: form.vehicleType,
      vehicleNumber: formattedNumber,
      vehicleBrand: form.vehicleBrand?.trim() || "",
      vehicleModel: form.vehicleModel?.trim() || "",
      vehicleColor: "",
      parkingSlot: "",
    }, {
      onSuccess() {
        router.replace(Routes.Profile.Vehicles);
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Add Vehicle" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Add Vehicle" onBack={() => router.back()} />
      <VehicleForm
        onSubmit={onSubmit}
        submitText="Save Vehicle"
        isPending={isSaving}
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


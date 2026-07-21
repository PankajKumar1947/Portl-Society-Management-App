import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import FlatForm from "../_components/flat-form";
import { UpdateFlatBody } from "@repo/schema";
import { useGetFlatDetails, useUpdateFlat } from "@repo/operations";
import type { ApiErrorResponse } from "@repo/api-client";

export default function EditFlatScreen() {
  const { id, flatId } = useLocalSearchParams<{ id: string; flatId: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: flat, isLoading: isFlatLoading } = useGetFlatDetails(flatId || "", { enabled: !!flatId });
  const { mutate: updateFlat, isPending: isUpdating } = useUpdateFlat(flatId || "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: UpdateFlatBody) => {
    if (!flatId) return;
    updateFlat(values, {
      onSuccess: () => {
        router.back();
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        Alert.alert("Failed to update flat", apiError.message || "Unknown error");
      },
    });
  };

  const initialValues = flat
    ? {
        societyId: flat.societyId,
        towerId: flat.towerId,
        flatNumber: flat.flatNumber,
        floorNumber: flat.floorNumber,
        numberOfRooms: flat.numberOfRooms,
        numberOfBathrooms: flat.numberOfBathrooms,
        kitchen: flat.kitchen,
        balcony: flat.balcony,
        hallRoom: flat.hallRoom,
        status: flat.status,
      }
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Flat Details" onBack={() => router.back()} />

        {isFlatLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <FlatForm<UpdateFlatBody>
              isEdit
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitButtonText="Update Flat"
              isSubmitting={isUpdating}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

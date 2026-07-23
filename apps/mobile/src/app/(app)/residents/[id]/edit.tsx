import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, View, Text, TouchableOpacity } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import StepPersonal from "../_components/step-personal";
import StepAllotment from "../_components/step-allotment";
import StepVehicle from "../_components/step-vehicle";
import { useAlert } from "@/context/alert-context";
import { useGetTowers, useGetResidentDetail, useUpdateResident } from "@repo/operations";
import { ResidentPersonalInput, ResidentAllotmentInput, ResidentVehicleInput } from "@repo/schema";

type EditStep = "personal" | "allotment" | "vehicle";

export default function EditResidentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState<EditStep>("personal");
  const { showAlert } = useAlert();

  const { data: towersData, isLoading: isTowersLoading } = useGetTowers();

  const { data: resident, isLoading: isResidentLoading } = useGetResidentDetail(id || "", { enabled: !!id });
  const { mutate: updateResidentMutation, isPending: isUpdating } = useUpdateResident(id || "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handlePersonalSubmit = (values: ResidentPersonalInput) => {
    if (!resident?.userId) return;
    updateResidentMutation(
      {
        userId: resident.userId,
        ...values,
      },
      {
        onSuccess: () => {
          showAlert({
            title: "Success",
            description: "Personal details updated successfully!",
            variant: "success",
          });
        },
      }
    );
  };

  const handleAllotmentSubmit = (values: Omit<ResidentAllotmentInput, "userId">) => {
    updateResidentMutation(
      values,
      {
        onSuccess: () => {
          showAlert({
            title: "Success",
            description: "Allotment details updated successfully!",
            variant: "success",
          });
        },
      }
    );
  };

  const handleVehicleSubmit = (values: ResidentVehicleInput) => {
    updateResidentMutation(
      values,
      {
        onSuccess: () => {
          showAlert({
            title: "Success",
            description: "Vehicle details updated successfully!",
            variant: "success",
            onConfirm: () => router.back(),
          });
        },
      }
    );
  };

  const isLoading = isTowersLoading || isResidentLoading;

  if (isLoading) {
    return <LoadingScreen title="Edit Resident" onBack={() => router.back()} />;
  }

  if (!resident) {
    return <NotFoundScreen title="Edit Resident" message="Resident not found" onBack={() => router.back()} />;
  }

  const towersOptions = towersData?.map((t) => ({
    label: t.towerName,
    value: t.towerId,
  })) || [];

  const initialPersonalValues: ResidentPersonalInput = {
    firstName: resident.userDetails?.firstName || "",
    lastName: resident.userDetails?.lastName || "",
    mobileNumber: resident.userDetails?.phoneNumber || "",
    email: resident.userDetails?.email || "",
  };

  const initialAllotmentValues: ResidentAllotmentInput = {
    userId: resident.userId,
    residentType: resident.residentType,
    relationship: resident.relationship,
    towerId: resident.towerId,
    flatNumber: resident.flatNumber,
    moveInDate: resident.moveInDate,
    ownershipStatus: resident.ownershipStatus,
    isPrimary: resident.isPrimary,
    docType: resident.docType,
    documentNumber: resident.documentNumber,
  };

  const initialVehicleValues: ResidentVehicleInput = {
    vehicles: (resident).vehicles || [],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScreenHeader title={`Edit ${resident.userDetails?.firstName || "Resident"}'s Info`} onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={[styles.stepItem, currentStep === "personal" && styles.stepItemActive]}
              onPress={() => setCurrentStep("personal")}
            >
              <Text style={[styles.stepNumber, currentStep === "personal" && styles.stepNumberActive]}>1</Text>
              <Text style={[styles.stepLabel, currentStep === "personal" && styles.stepLabelActive]}>Personal</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepItem, currentStep === "allotment" && styles.stepItemActive]}
              onPress={() => setCurrentStep("allotment")}
            >
              <Text style={[styles.stepNumber, currentStep === "allotment" && styles.stepNumberActive]}>2</Text>
              <Text style={[styles.stepLabel, currentStep === "allotment" && styles.stepLabelActive]}>Allotment</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepItem, currentStep === "vehicle" && styles.stepItemActive]}
              onPress={() => setCurrentStep("vehicle")}
            >
              <Text style={[styles.stepNumber, currentStep === "vehicle" && styles.stepNumberActive]}>3</Text>
              <Text style={[styles.stepLabel, currentStep === "vehicle" && styles.stepLabelActive]}>Vehicle</Text>
            </TouchableOpacity>
          </View>

          {currentStep === "personal" && (
            <StepPersonal
              initialValues={initialPersonalValues}
              onSubmit={handlePersonalSubmit}
              isSubmitting={isUpdating}
              submitButtonText="Save Changes"
            />
          )}

          {currentStep === "allotment" && (
            <StepAllotment
              initialValues={initialAllotmentValues}
              towers={towersOptions}
              onSubmit={handleAllotmentSubmit}
              isSubmitting={isUpdating}
              submitButtonText="Save Changes"
            />
          )}

          {currentStep === "vehicle" && (
            <StepVehicle
              initialValues={initialVehicleValues}
              onSubmit={handleVehicleSubmit}
              isSubmitting={isUpdating}
              submitButtonText="Save Changes"
            />
          )}
        </ScrollView>
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
    gap: theme.spacing.lg,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  stepItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    opacity: 0.5,
  },
  stepItemActive: {
    opacity: 1,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.textMuted,
    color: theme.colors.surface,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 20,
  },
  stepNumberActive: {
    color: theme.colors.surface,
    backgroundColor: theme.colors.primary,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  stepLabelActive: {
    color: theme.colors.primary,
  },
  stepDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
  },
});

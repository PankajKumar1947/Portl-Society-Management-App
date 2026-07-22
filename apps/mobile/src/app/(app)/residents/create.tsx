import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, View, ActivityIndicator, Text } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import StepPersonal from "./_components/step-personal";
import StepAllotment from "./_components/step-allotment";
import StepVehicle from "./_components/step-vehicle";
import OtpVerificationModal from "./_components/otp-modal";
import { useAlert } from "@/context/alert-context";
import {
  useGetTowers,
  useOnboardResidentPersonal,
  useOnboardResidentAllotment,
  useOnboardResidentVehicle,
} from "@repo/operations";
import { ResidentPersonalInput, ResidentAllotmentInput, ResidentVehicleInput } from "@repo/schema";

type OnboardingStep = "personal" | "allotment" | "vehicle";

export default function CreateResidentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("personal");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);

  const [personalDetails, setPersonalDetails] = useState<ResidentPersonalInput | null>(null);
  const [allotmentDetails, setAllotmentDetails] = useState<ResidentAllotmentInput | null>(null);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [createdResidentId, setCreatedResidentId] = useState<string | null>(null);

  const { data: towersData, isLoading: isTowersLoading } = useGetTowers();

  const { mutateAsync: onboardPersonal, isPending: isStep1Pending } = useOnboardResidentPersonal();
  const { mutateAsync: onboardAllotment, isPending: isStep2Pending } = useOnboardResidentAllotment();
  const { mutateAsync: onboardVehicle, isPending: isStep3Pending } = useOnboardResidentVehicle();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handlePersonalSubmit = async (values: ResidentPersonalInput) => {
    try {
      setPersonalDetails(values);
      const res = await onboardPersonal(values);
      const userId = res?.data?.userId;
      if (!userId) {
        throw new Error("Unable to retrieve registered user credentials.");
      }
      setTempUserId(userId);
      setIsOtpVisible(true);
    } catch (err: any) {
      // Handled globally by ApiErrorHandler
    }
  };

  const handleOtpSuccess = () => {
    if (tempUserId) {
      setCreatedUserId(tempUserId);
      setIsOtpVisible(false);
      setCurrentStep("allotment");
    }
  };

  const handleAllotmentSubmit = async (values: Omit<ResidentAllotmentInput, "userId">) => {
    if (!createdUserId) {
      showAlert({
        title: "Error",
        description: "Please complete step 1 first.",
        variant: "error",
      });
      return;
    }
    try {
      const payload: ResidentAllotmentInput = {
        ...values,
        userId: createdUserId,
      };
      setAllotmentDetails(payload);
      const res = await onboardAllotment(payload);
      const residentId = res?.data?.residentId;
      if (!residentId) {
        throw new Error("Unable to retrieve registered resident profile.");
      }
      setCreatedResidentId(residentId);
      setCurrentStep("vehicle");
    } catch (err: any) {
      // Handled globally by ApiErrorHandler
    }
  };

  const handleVehicleSubmit = async (values: ResidentVehicleInput) => {
    if (!createdResidentId) {
      showAlert({
        title: "Error",
        description: "Please complete previous steps first.",
        variant: "error",
      });
      return;
    }
    try {
      await onboardVehicle({
        residentId: createdResidentId,
        data: values,
      });
      showAlert({
        title: "Success",
        description: "Resident registered successfully!",
        variant: "success",
        onConfirm: () => router.back(),
      });
    } catch (err: any) {
      // Handled globally by ApiErrorHandler
    }
  };

  const handleBack = () => {
    if (currentStep === "vehicle") {
      setCurrentStep("allotment");
    } else if (currentStep === "allotment") {
      setCurrentStep("personal");
    }
  };

  const towersOptions = towersData?.map((t) => ({
    label: t.towerName,
    value: t.towerId,
  })) || [];

  const isLoading = isTowersLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScreenHeader title="Add New Resident" onBack={() => router.back()} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepperContainer}>
              <View style={[styles.stepItem, currentStep === "personal" && styles.stepItemActive]}>
                <Text style={[styles.stepNumber, currentStep === "personal" && styles.stepNumberActive]}>1</Text>
                <Text style={[styles.stepLabel, currentStep === "personal" && styles.stepLabelActive]}>Personal</Text>
              </View>

              <View style={styles.stepDivider} />

              <View style={[styles.stepItem, currentStep === "allotment" && styles.stepItemActive]}>
                <Text style={[styles.stepNumber, currentStep === "allotment" && styles.stepNumberActive]}>2</Text>
                <Text style={[styles.stepLabel, currentStep === "allotment" && styles.stepLabelActive]}>Allotment</Text>
              </View>

              <View style={styles.stepDivider} />

              <View style={[styles.stepItem, currentStep === "vehicle" && styles.stepItemActive]}>
                <Text style={[styles.stepNumber, currentStep === "vehicle" && styles.stepNumberActive]}>3</Text>
                <Text style={[styles.stepLabel, currentStep === "vehicle" && styles.stepLabelActive]}>Vehicle</Text>
              </View>
            </View>

            {currentStep === "personal" && (
              <StepPersonal
                initialValues={personalDetails || undefined}
                onSubmit={handlePersonalSubmit}
                isSubmitting={isStep1Pending}
              />
            )}

            {currentStep === "allotment" && createdUserId && (
              <StepAllotment
                initialValues={{
                  ...allotmentDetails,
                  userId: createdUserId,
                }}
                towers={towersOptions}
                onSubmit={handleAllotmentSubmit}
                onBack={handleBack}
                isSubmitting={isStep2Pending}
              />
            )}

            {currentStep === "vehicle" && (
              <StepVehicle
                initialValues={undefined}
                onSubmit={handleVehicleSubmit}
                onBack={handleBack}
                isSubmitting={isStep3Pending}
                submitButtonText="Finish Registration"
              />
            )}
          </ScrollView>
        )}
        <OtpVerificationModal
          visible={isOtpVisible}
          email={personalDetails?.email || ""}
          onSuccess={handleOtpSuccess}
          onClose={() => setIsOtpVisible(false)}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

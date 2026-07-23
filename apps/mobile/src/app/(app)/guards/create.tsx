import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import GuardForm, { GuardFormValues } from "./_components/guard-form";
import OtpVerificationModal from "../residents/_components/otp-modal";
import { useAlert } from "@/context/alert-context";
import { useOnboardGuardPersonal, useOnboardGuardDuty } from "@repo/operations";

export default function CreateGuardScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState<"personal" | "duty">("personal");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [personalDetails, setPersonalDetails] = useState<GuardFormValues | null>(null);

  const { mutate: onboardPersonal, isPending: isStep1Pending } = useOnboardGuardPersonal();
  const { mutate: onboardDuty, isPending: isStep2Pending } = useOnboardGuardDuty();

  const handleFormSubmit = (values: GuardFormValues) => {
    if (currentStep === "personal") {
      setPersonalDetails(values);
      onboardPersonal(values, {
        onSuccess: (res) => {
          setCreatedUserId(res.userId);
          setIsOtpVisible(true);
        },
      });
    } else {
      if (!createdUserId) {
        showAlert({
          title: "Error",
          description: "Missing user credentials. Please complete step 1 first.",
          variant: "error",
        });
        return;
      }
      onboardDuty(
        {
          userId: createdUserId,
          shiftType: values.shiftType,
          gateNumber: values.gateNumber,
          agencyName: values.agencyName,
        },
        {
          onSuccess: () => {
            showAlert({
              title: "Guard Registered",
              description: `Security guard ${personalDetails?.firstName || ""} has been successfully added.`,
              variant: "success",
              onConfirm: () => router.back(),
            });
          },
        }
      );
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpVisible(false);
    setCurrentStep("duty");
  };

  const handleBack = () => {
    if (currentStep === "duty") {
      setCurrentStep("personal");
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Register Guard" onBack={handleBack} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stepper indicator */}
          <View style={styles.stepperContainer}>
            <View style={[styles.stepItem, currentStep === "personal" && styles.stepItemActive]}>
              <Text style={[styles.stepNumber, currentStep === "personal" && styles.stepNumberActive]}>1</Text>
              <Text style={[styles.stepLabel, currentStep === "personal" && styles.stepLabelActive]}>Personal</Text>
            </View>

            <View style={styles.stepDivider} />

            <View style={[styles.stepItem, currentStep === "duty" && styles.stepItemActive]}>
              <Text style={[styles.stepNumber, currentStep === "duty" && styles.stepNumberActive]}>2</Text>
              <Text style={[styles.stepLabel, currentStep === "duty" && styles.stepLabelActive]}>Duty Info</Text>
            </View>
          </View>

          <GuardForm
            initialValues={personalDetails || undefined}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleFormSubmit}
            isSubmitting={isStep1Pending || isStep2Pending}
            submitButtonText="Register Guard"
          />
        </ScrollView>

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
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
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

import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import StepPersonal from "./_components/step-personal";
import StepIdentity from "./_components/step-identity";
import StepDuty from "./_components/step-duty";
import OtpVerificationModal from "../residents/_components/otp-modal";
import { useAlert } from "@/context/alert-context";
import { useOnboardGuardPersonal, useOnboardGuardIdentity, useOnboardGuardDuty } from "@repo/operations";
import { GuardPersonalInput, GuardIdentificationInput, GuardDutyInput } from "@repo/schema";

export default function CreateGuardScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState<"personal" | "identification" | "duty">("personal");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  // Buffer state to keep values during steps transitions
  const [personalValues, setPersonalValues] = useState<Partial<GuardPersonalInput>>({});
  const [identityValues, setIdentityValues] = useState<Partial<GuardIdentificationInput>>({});
  const [dutyValues, setDutyValues] = useState<Partial<Omit<GuardDutyInput, "userId">>>({});

  const { mutate: onboardPersonal, isPending: isStep1Pending } = useOnboardGuardPersonal();
  const { mutate: onboardIdentity, isPending: isStep2Pending } = useOnboardGuardIdentity();
  const { mutate: onboardDuty, isPending: isStep3Pending } = useOnboardGuardDuty();

  const handleStep1Submit = (values: GuardPersonalInput) => {
    setPersonalValues(values);
    onboardPersonal(values, {
      onSuccess: (res) => {
        setCreatedUserId(res.userId);
        setIsOtpVisible(true);
      },
    });
  };

  const handleStep2Submit = (values: GuardIdentificationInput) => {
    if (!createdUserId) {
      showAlert({
        title: "Error",
        description: "Missing user credentials. Please complete step 1 first.",
        variant: "error",
      });
      return;
    }
    setIdentityValues(values);
    onboardIdentity(
      {
        userId: createdUserId,
        ...values,
      },
      {
        onSuccess: () => {
          setCurrentStep("duty");
        },
      }
    );
  };

  const handleStep3Submit = (values: Omit<GuardDutyInput, "userId">) => {
    if (!createdUserId) {
      showAlert({
        title: "Error",
        description: "Missing user credentials. Please complete step 1 first.",
        variant: "error",
      });
      return;
    }
    setDutyValues(values);
    onboardDuty(
      {
        userId: createdUserId,
        ...values,
      },
      {
        onSuccess: () => {
          showAlert({
            title: "Guard Registered",
            description: `Security guard ${personalValues.firstName || ""} has been successfully added.`,
            variant: "success",
            onConfirm: () => router.back(),
          });
        },
      }
    );
  };

  const handleOtpSuccess = () => {
    setIsOtpVisible(false);
    setCurrentStep("identification");
  };

  const handleBack = () => {
    if (currentStep === "duty") {
      setCurrentStep("identification");
    } else if (currentStep === "identification") {
      setCurrentStep("personal");
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title="Register Guard" onBack={handleBack} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Stepper indicator */}
          <View style={styles.stepperContainer}>
            <View style={[styles.stepItem, currentStep === "personal" && styles.stepItemActive]}>
              <Text style={[styles.stepNumber, currentStep === "personal" && styles.stepNumberActive]}>1</Text>
              <Text style={[styles.stepLabel, currentStep === "personal" && styles.stepLabelActive]}>Personal</Text>
            </View>

            <View style={styles.stepDivider} />

            <View style={[styles.stepItem, currentStep === "identification" && styles.stepItemActive]}>
              <Text style={[styles.stepNumber, currentStep === "identification" && styles.stepNumberActive]}>2</Text>
              <Text style={[styles.stepLabel, currentStep === "identification" && styles.stepLabelActive]}>Identity</Text>
            </View>

            <View style={styles.stepDivider} />

            <View style={[styles.stepItem, currentStep === "duty" && styles.stepItemActive]}>
              <Text style={[styles.stepNumber, currentStep === "duty" && styles.stepNumberActive]}>3</Text>
              <Text style={[styles.stepLabel, currentStep === "duty" && styles.stepLabelActive]}>Duty Info</Text>
            </View>
          </View>

          {currentStep === "personal" && (
            <StepPersonal
              initialValues={personalValues}
              onSubmit={handleStep1Submit}
              isSubmitting={isStep1Pending}
              submitButtonText="Next"
            />
          )}

          {currentStep === "identification" && (
            <StepIdentity
              initialValues={identityValues}
              onSubmit={handleStep2Submit}
              isSubmitting={isStep2Pending}
              submitButtonText="Next"
            />
          )}

          {currentStep === "duty" && (
            <StepDuty
              initialValues={dutyValues}
              onSubmit={handleStep3Submit}
              isSubmitting={isStep3Pending}
              submitButtonText="Register Guard"
            />
          )}
        </ScrollView>

        <OtpVerificationModal
          visible={isOtpVisible}
          email={personalValues.email || ""}
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
    paddingBottom: 80,
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

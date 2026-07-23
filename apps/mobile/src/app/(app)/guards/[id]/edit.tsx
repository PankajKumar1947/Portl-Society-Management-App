import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import StepPersonal from "../_components/step-personal";
import StepIdentity from "../_components/step-identity";
import StepDuty from "../_components/step-duty";
import { useAlert } from "@/context/alert-context";
import { useGetGuardDetail, useUpdateGuard } from "@repo/operations";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { GuardPersonalInput, GuardIdentificationInput, GuardDutyInput } from "@repo/schema";

interface GuardEditFormValues extends GuardPersonalInput, GuardIdentificationInput, Omit<GuardDutyInput, "userId"> { }

export default function EditGuardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState<"personal" | "identification" | "duty">("personal");

  const { data: guard, isLoading } = useGetGuardDetail(id || "", { enabled: !!id });
  const { mutate: updateGuardMutation, isPending: isSubmitting } = useUpdateGuard(id || "");

  // Cumulative state representing all form parameters
  const [formValues, setFormValues] = useState<GuardEditFormValues | null>(null);

  // Populate formValues once guard details load
  useEffect(() => {
    if (guard && !formValues) {
      const userDetails = guard.userDetails;
      setFormValues({
        firstName: userDetails?.firstName || "",
        lastName: userDetails?.lastName || "",
        email: userDetails?.email || "",
        phoneNumber: userDetails?.phoneNumber || "",
        aadharNumber: guard.aadharNumber || "",
        streetAddress: guard.streetAddress || "",
        city: guard.city || "",
        state: guard.state || "",
        country: guard.country || "",
        zipCode: guard.zipCode || "",
        emergencyContact: guard.emergencyContact || "",
        shiftType: (guard.shiftType) || "DAY",
        gateNumber: guard.gateNumber || "Gate 1",
        agencyName: guard.agencyName || "",
        policeVerificationStatus: (guard.policeVerificationStatus) || "PENDING",
      });
    }
  }, [guard, formValues]);

  const handleStep1Submit = (values: GuardPersonalInput) => {
    setFormValues((prev) => prev ? { ...prev, ...values } : null);
    setCurrentStep("identification");
  };

  const handleStep2Submit = (values: GuardIdentificationInput) => {
    setFormValues((prev) => prev ? { ...prev, ...values } : null);
    setCurrentStep("duty");
  };

  const handleStep3Submit = (values: Omit<GuardDutyInput, "userId">) => {
    if (!formValues) return;
    const updatedValues = { ...formValues, ...values };
    setFormValues(updatedValues);

    updateGuardMutation(updatedValues, {
      onSuccess: () => {
        showAlert({
          title: "Guard Details Updated",
          description: `Security guard ${updatedValues.firstName} ${updatedValues.lastName} details have been updated.`,
          variant: "success",
          onConfirm: () => router.back(),
        });
      },
    });
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

  if (isLoading || !formValues) {
    return <LoadingScreen title="Edit Guard" onBack={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title="Edit Guard" onBack={handleBack} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Stepper indicator */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              onPress={() => setCurrentStep("personal")}
              style={[styles.stepItem, currentStep === "personal" && styles.stepItemActive]}
            >
              <Text style={[styles.stepNumber, currentStep === "personal" && styles.stepNumberActive]}>1</Text>
              <Text style={[styles.stepLabel, currentStep === "personal" && styles.stepLabelActive]}>Personal</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              onPress={() => setCurrentStep("identification")}
              style={[styles.stepItem, currentStep === "identification" && styles.stepItemActive]}
            >
              <Text style={[styles.stepNumber, currentStep === "identification" && styles.stepNumberActive]}>2</Text>
              <Text style={[styles.stepLabel, currentStep === "identification" && styles.stepLabelActive]}>Identity</Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              onPress={() => setCurrentStep("duty")}
              style={[styles.stepItem, currentStep === "duty" && styles.stepItemActive]}
            >
              <Text style={[styles.stepNumber, currentStep === "duty" && styles.stepNumberActive]}>3</Text>
              <Text style={[styles.stepLabel, currentStep === "duty" && styles.stepLabelActive]}>Duty Info</Text>
            </TouchableOpacity>
          </View>

          {currentStep === "personal" && (
            <StepPersonal
              initialValues={formValues}
              onSubmit={handleStep1Submit}
              submitButtonText="Next"
            />
          )}

          {currentStep === "identification" && (
            <StepIdentity
              initialValues={formValues}
              onSubmit={handleStep2Submit}
              submitButtonText="Next"
            />
          )}

          {currentStep === "duty" && (
            <StepDuty
              initialValues={formValues}
              onSubmit={handleStep3Submit}
              isSubmitting={isSubmitting}
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

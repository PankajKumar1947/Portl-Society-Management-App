import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import GuardForm, { GuardFormValues } from "../_components/guard-form";
import { useAlert } from "@/context/alert-context";
import { useGetGuardDetail, useUpdateGuard } from "@repo/operations";
import { ActivityIndicator } from "react-native";

export default function EditGuardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState<"personal" | "duty">("personal");

  const { data: guard, isLoading } = useGetGuardDetail(id || "", { enabled: !!id });
  const { mutate: updateGuardMutation, isPending: isSubmitting } = useUpdateGuard(id || "");

  const handleFormSubmit = (values: GuardFormValues) => {
    if (currentStep === "personal") {
      setCurrentStep("duty");
    } else {
      updateGuardMutation(values, {
        onSuccess: () => {
          showAlert({
            title: "Guard Details Updated",
            description: `Security guard ${values.firstName} ${values.lastName} details have been updated.`,
            variant: "success",
            onConfirm: () => router.back(),
          });
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep === "duty") {
      setCurrentStep("personal");
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Guard" onBack={() => router.back()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const userDetails = guard?.userDetails;
  const initialValues = guard ? {
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    email: userDetails?.email || "",
    phoneNumber: userDetails?.phoneNumber || "",
    shiftType: guard.shiftType as "DAY" | "NIGHT",
    gateNumber: guard.gateNumber,
    agencyName: guard.agencyName,
  } : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Guard" onBack={handleBack} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
              onPress={() => setCurrentStep("duty")}
              style={[styles.stepItem, currentStep === "duty" && styles.stepItemActive]}
            >
              <Text style={[styles.stepNumber, currentStep === "duty" && styles.stepNumberActive]}>2</Text>
              <Text style={[styles.stepLabel, currentStep === "duty" && styles.stepLabelActive]}>Duty Info</Text>
            </TouchableOpacity>
          </View>

          <GuardForm
            initialValues={initialValues}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Save Changes"
          />
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

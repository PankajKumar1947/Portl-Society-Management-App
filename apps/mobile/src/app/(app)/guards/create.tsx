import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import GuardForm, { GuardFormValues } from "./_components/guard-form";
import { useAlert } from "@/context/alert-context";

export default function CreateGuardScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [currentStep, setCurrentStep] = useState<"personal" | "duty">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values: GuardFormValues) => {
    setIsSubmitting(true);
    try {
      setTimeout(() => {
        setIsSubmitting(false);
        showAlert({
          title: "Guard Registered",
          description: `Security guard ${values.firstName} ${values.lastName} has been successfully added.`,
          variant: "success",
          onConfirm: () => router.back(),
        });
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
    }
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
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Register Guard"
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

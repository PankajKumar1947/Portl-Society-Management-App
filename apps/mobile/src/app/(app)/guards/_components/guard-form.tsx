import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import Button from "@/components/ui/button";
import { theme } from "@/constants";

export interface GuardFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shiftType: "DAY" | "NIGHT";
  gateNumber: string;
  agencyName?: string;
}

interface GuardFormProps {
  initialValues?: Partial<GuardFormValues>;
  onSubmit: (values: GuardFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  currentStep: "personal" | "duty";
  onStepChange: (step: "personal" | "duty") => void;
}

const SHIFT_OPTIONS = [
  { label: "Day Shift (08:00 AM - 08:00 PM)", value: "DAY" },
  { label: "Night Shift (08:00 PM - 08:00 AM)", value: "NIGHT" },
];

const GATE_OPTIONS = [
  { label: "Gate 1 (Main Entry)", value: "Gate 1" },
  { label: "Gate 2 (Back Exit)", value: "Gate 2" },
  { label: "Gate 3 (Service Entry)", value: "Gate 3" },
];

export default function GuardForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Guard",
  currentStep,
  onStepChange,
}: GuardFormProps) {
  const methods = useForm<GuardFormValues>({
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      phoneNumber: initialValues?.phoneNumber || "",
      shiftType: initialValues?.shiftType || "DAY",
      gateNumber: initialValues?.gateNumber || "Gate 1",
      agencyName: initialValues?.agencyName || "",
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        {currentStep === "personal" ? (
          <View style={styles.formSection}>
            <FormInput
              name="firstName"
              label="First Name"
              placeholder="Enter guard first name"
              required
            />
            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Enter guard last name"
              required
            />
            <FormInput
              name="email"
              label="Email Address"
              placeholder="e.g. guard@society.com"
              keyboardType="email-address"
              required
            />
            <FormInput
              name="phoneNumber"
              label="Phone Number"
              placeholder="e.g. 9876543210"
              keyboardType="phone-pad"
              maxLength={10}
              required
            />
          </View>
        ) : (
          <View style={styles.formSection}>
            <FormSelect
              name="shiftType"
              label="Shift Assignment"
              options={SHIFT_OPTIONS}
            />
            <FormSelect
              name="gateNumber"
              label="Assigned Duty Gate"
              options={GATE_OPTIONS}
            />
            <FormInput
              name="agencyName"
              label="Security Agency Name"
              placeholder="e.g. Swift Security Services"
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          {currentStep === "duty" && (
            <Button
              onPress={() => onStepChange("personal")}
              variant="outline"
              style={styles.flexButton}
            >
              Back
            </Button>
          )}
          <Button
            onPress={currentStep === "personal" ? () => onStepChange("duty") : handleSubmit(onSubmit)}
            loading={isSubmitting}
            style={styles.flexButton}
          >
            {currentStep === "personal" ? "Next" : submitButtonText}
          </Button>
        </View>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  formSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    gap: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  flexButton: {
    flex: 1,
  },
});

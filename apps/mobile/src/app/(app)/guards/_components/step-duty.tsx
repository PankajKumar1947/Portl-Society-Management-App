import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuardDutyInput, SHIFT_OPTIONS, GATE_OPTIONS, POLICE_OPTIONS, dutyFormSchema, DutyFormValues } from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import Button from "@/components/ui/button";
import { theme } from "@/constants";

interface StepDutyProps {
  initialValues?: Partial<GuardDutyInput>;
  onSubmit: (values: DutyFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}
export default function StepDuty({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Guard",
}: StepDutyProps) {
  const methods = useForm<DutyFormValues>({
    resolver: zodResolver(dutyFormSchema),
    defaultValues: {
      shiftType: initialValues?.shiftType || "DAY",
      gateNumber: initialValues?.gateNumber || "Gate 1",
      agencyName: initialValues?.agencyName || "",
      policeVerificationStatus: initialValues?.policeVerificationStatus || "PENDING",
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.section}>
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
          <FormSelect
            name="policeVerificationStatus"
            label="Police Verification Status"
            options={POLICE_OPTIONS}
          />
          <FormInput
            name="agencyName"
            label="Security Agency Name"
            placeholder="e.g. Swift Security Services"
          />
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.submitButton}
        >
          {submitButtonText}
        </Button>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    gap: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
});

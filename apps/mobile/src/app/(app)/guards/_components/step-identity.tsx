import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guardIdentificationSchema, GuardIdentificationInput } from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";
import { theme } from "@/constants";

interface StepIdentityProps {
  initialValues?: Partial<GuardIdentificationInput>;
  onSubmit: (values: GuardIdentificationInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function StepIdentity({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Next",
}: StepIdentityProps) {
  const methods = useForm<GuardIdentificationInput>({
    resolver: zodResolver(guardIdentificationSchema),
    defaultValues: {
      aadharNumber: initialValues?.aadharNumber || "",
      streetAddress: initialValues?.streetAddress || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      country: initialValues?.country || "",
      zipCode: initialValues?.zipCode || "",
      emergencyContact: initialValues?.emergencyContact || "",
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.section}>
          <FormInput
            name="aadharNumber"
            label="Aadhar Card Number"
            placeholder="Enter 12-digit Aadhar Card number"
            keyboardType="number-pad"
            maxLength={12}
            required
          />
          <FormInput
            name="emergencyContact"
            label="Emergency Phone Number"
            placeholder="e.g. 9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            required
          />
          <FormInput
            name="streetAddress"
            label="Street Address"
            placeholder="e.g. Flat/House No, Building, Street"
            required
          />
          <FormInput
            name="city"
            label="City"
            placeholder="e.g. Mumbai"
            required
          />
          <FormInput
            name="state"
            label="State"
            placeholder="e.g. Maharashtra"
            required
          />
          <FormInput
            name="country"
            label="Country"
            placeholder="e.g. India"
            required
          />
          <FormInput
            name="zipCode"
            label="Pin Code"
            placeholder="e.g. 400001"
            keyboardType="number-pad"
            maxLength={6}
            required
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

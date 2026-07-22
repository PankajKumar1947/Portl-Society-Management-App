import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { residentPersonalSchema, ResidentPersonalInput } from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import FormPhone from "@/components/ui/form-phone";
import Button from "@/components/ui/button";
import { theme } from "@/constants";

interface StepPersonalProps {
  initialValues?: Partial<ResidentPersonalInput>;
  onSubmit: (values: ResidentPersonalInput) => void;
  isSubmitting?: boolean;
}

export default function StepPersonal({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: StepPersonalProps) {
  const methods = useForm<ResidentPersonalInput>({
    resolver: zodResolver(residentPersonalSchema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      mobileNumber: initialValues?.mobileNumber || "",
      email: initialValues?.email || "",
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.section}>
          <FormInput
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
          />
          <FormInput
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
          />
          <FormPhone
            name="mobileNumber"
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            required
          />
          <FormInput
            name="email"
            label="Email Address"
            placeholder="e.g. resident@example.com"
            keyboardType="email-address"
            required
          />
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.submitButton}
        >
          Next
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

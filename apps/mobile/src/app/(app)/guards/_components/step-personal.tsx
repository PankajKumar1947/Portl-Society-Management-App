import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guardPersonalSchema, GuardPersonalInput } from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";
import { theme } from "@/constants";

interface StepPersonalProps {
  initialValues?: Partial<GuardPersonalInput>;
  onSubmit: (values: GuardPersonalInput) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function StepPersonal({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Next",
}: StepPersonalProps) {
  const methods = useForm<GuardPersonalInput>({
    resolver: zodResolver(guardPersonalSchema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      phoneNumber: initialValues?.phoneNumber || "",
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

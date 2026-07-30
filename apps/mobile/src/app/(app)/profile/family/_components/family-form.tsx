import React from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { theme } from "@/constants";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import FormDate from "@/components/ui/form-date";
import { RELATIONSHIP_OPTIONS, AddFamilyMemberInput } from "@repo/schema";

interface FamilyMemberFormProps {
  onSubmit: (data: AddFamilyMemberInput) => Promise<void> | void;
  defaultValues?: AddFamilyMemberInput;
  isPending?: boolean;
  submitText: string;
}

const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  onSubmit,
  defaultValues = { firstName: "", lastName: "", relationship: "OTHER", phoneNumber: "", dateOfBirth: "" },
  isPending = false,
  submitText,
}) => {
  const methods = useForm<AddFamilyMemberInput>({
    defaultValues,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FormProvider {...methods}>
          <FormInput
            name="firstName"
            label="First Name"
            placeholder="First Name"
            required
          />

          <View style={styles.fieldGap} />

          <FormInput
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            required
          />

          <View style={styles.fieldGap} />

          <FormSelect
            name="relationship"
            label="Select relationship"
            options={RELATIONSHIP_OPTIONS}
            required
          />

          <View style={styles.fieldGap} />

          <FormDate
            name="dateOfBirth"
            label="Select DOB"
            required
          />

          <View style={styles.fieldGap} />

          <FormInput
            name="phoneNumber"
            label="Enter mobile number"
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            required
          />
        </FormProvider>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          variant="primary"
          style={styles.submitButton}
          onPress={methods.handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isPending}
        >
          {submitText}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FamilyMemberForm;

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});


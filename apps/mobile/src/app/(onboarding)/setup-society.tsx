import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { createSocietySchema, CreateSocietyBody } from "@repo/schema";
import { useCreateSociety } from "@repo/operations";
import { useAuth } from "@/context/auth-context";
import { Routes } from "@/constants/routes";
import { theme } from "@/constants";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormPhone from "@/components/ui/form-phone";
import FormSelect, { SelectOption } from "@/components/ui/form-select";
import type { ApiErrorResponse } from "@repo/api-client";

const SOCIETY_TYPE_OPTIONS: SelectOption[] = [
  { label: "Apartment", value: "APARTMENT" },
  { label: "Gated Community", value: "GATED_COMMUNITY" },
  { label: "Villa", value: "VILLA" },
  { label: "Residential Complex", value: "RESIDENTIAL_COMPLEX" },
  { label: "Mixed Use Building", value: "MIXED_USE" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: SelectOption[] = Array.from(
  { length: currentYear - 1800 + 1 },
  (_, i) => {
    const year = currentYear - i;
    return { label: year.toString(), value: year.toString() };
  }
);

interface FormValues {
  societyName: string;
  societyType: "APARTMENT" | "GATED_COMMUNITY" | "VILLA" | "RESIDENTIAL_COMPLEX" | "MIXED_USE";
  primaryContactName: string;
  primaryContactNumber: string;
  primaryContactEmail: string;
  establishedYear?: string | number;
  address?: string;
}

export default function SetupSocietyScreen() {
  const router = useRouter();
  const { mutate: createSociety, isPending: isSubmitting } = useCreateSociety();
  const { markSocietyCreated } = useAuth();

  const methods = useForm<FormValues>({
    resolver: zodResolver(createSocietySchema),
    defaultValues: {
      societyName: "",
      societyType: "APARTMENT",
      primaryContactName: "",
      primaryContactNumber: "",
      primaryContactEmail: "",
      establishedYear: currentYear.toString(),
      address: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    // Make sure establishedYear is converted to a number if passed as string
    const payload: CreateSocietyBody = {
      ...data,
      establishedYear: data.establishedYear ? Number(data.establishedYear) : undefined,
    };

    createSociety(payload, {
      onSuccess: (res) => {
        Alert.alert(
          "Setup Completed",
          `Your society "${res.society.societyName}" has been successfully set up!\n\nJoining Code: ${res.society.societyCode}`,
          [
            {
              text: "Continue",
              onPress: async () => {
                await markSocietyCreated();
                router.replace("/(app)");
              },
            },
          ],
        );
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        Alert.alert("Setup Failed", apiError.message);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Set Up Society</Text>
          <Text style={styles.subtitle}>
            Enter the details of your society or apartment community to register it.
          </Text>
        </View>

        <FormProvider {...methods}>
          <View style={styles.form}>
            <FormInput
              name="societyName"
              label="Society Name"
              placeholder="e.g. Green Meadows Apartment"
              required
            />

            <FormSelect
              name="societyType"
              label="Society Type"
              options={SOCIETY_TYPE_OPTIONS}
              required
            />

            <FormInput
              name="primaryContactName"
              label="Primary Contact Name"
              placeholder="e.g. John Doe (Society President)"
              required
            />

            <FormPhone
              name="primaryContactNumber"
              label="Primary Contact Number"
              placeholder="Enter 10-digit number"
              required
            />

            <FormInput
              name="primaryContactEmail"
              label="Primary Contact Email"
              placeholder="e.g. society@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <FormSelect
              name="establishedYear"
              label="Established Year"
              options={YEAR_OPTIONS}
              placeholder="Select established year"
            />

            <FormInput
              name="address"
              label="Address"
              placeholder="Full address of the society"
              multiline
              numberOfLines={3}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Complete Setup
            </Button>
          </View>
        </FormProvider>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.section,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    height: 52,
  },
});

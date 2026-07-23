import React from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormTextArea from "@/components/ui/form-textarea";
import FormSelect from "@/components/ui/form-select";
import { useCreateComplaint } from "@repo/operations";
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITY, CreateComplaintBody } from "@repo/schema";

const CATEGORY_OPTIONS = COMPLAINT_CATEGORIES.map((c) => ({
  label: c.replace(/_/g, " "),
  value: c,
}));

export default function CreateComplaintScreen() {
  const router = useRouter();
  const { mutateAsync: createComplaint, isPending } = useCreateComplaint();

  const methods = useForm<CreateComplaintBody>({
    defaultValues: {
      category: "" as CreateComplaintBody["category"],
      subject: "",
      description: "",
      priority: COMPLAINT_PRIORITY.MEDIUM,
    },
  });

  const onSubmit = async (values: CreateComplaintBody) => {
    await createComplaint(values);
    router.replace(Routes.Complaints.Index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title="Raise a Complaint" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FormProvider {...methods}>
            <FormSelect
              name="category"
              label="Complaint Category"
              options={CATEGORY_OPTIONS}
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="subject"
              label="Subject"
              placeholder="e.g. Noise complaint"
              required
            />

            <View style={styles.fieldGap} />

            <FormTextArea
              name="description"
              label="Detailed Description"
              placeholder="Provide details about the issue..."
              required
            />

            <View style={styles.bottomGap} />

            <Button
              variant="primary"
              style={styles.submitButton}
              onPress={methods.handleSubmit(onSubmit)}
              disabled={isPending}
              loading={isPending}
            >
              Submit Complaint
            </Button>
          </FormProvider>
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
    paddingBottom: theme.spacing.xxl,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  bottomGap: {
    height: theme.spacing.xl,
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

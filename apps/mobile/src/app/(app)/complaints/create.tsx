import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormTextArea from "@/components/ui/form-textarea";
import FormSelect from "@/components/ui/form-select";
import AttachmentPicker, { AttachmentItem } from "@/components/ui/attachment-picker";

const CATEGORY_OPTIONS = [
  { label: "Noisy Neighbor", value: "Noisy Neighbor" },
  { label: "Security Behavior", value: "Security Behavior" },
  { label: "Housekeeping Issue", value: "Housekeeping Issue" },
  { label: "Builder Defect", value: "Builder Defect" },
  { label: "Other", value: "Other" },
];

export default function CreateComplaintScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm({
    defaultValues: {
      category: "",
      subject: "",
      description: "",
    },
  });

  const onSubmit = () => {
    router.replace(Routes.Complaints.Index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Raise a Complaint" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
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
              placeholder="e.g. Neighbor playing loud music repeatedly"
              required
            />

            <View style={styles.fieldGap} />

            <FormTextArea
              name="description"
              label="Detailed Description"
              placeholder="Provide details about the neighbor, security staff behavior, area location, or building defect..."
              required
            />

            <View style={styles.fieldGap} />

            <AttachmentPicker
              attachments={attachments}
              onAdd={(item) => setAttachments((prev) => [...prev, item])}
              onRemove={(index) => setAttachments((prev) => prev.filter((_, i) => i !== index))}
              maxAttachments={3}
            />
          </FormProvider>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            Submit Complaint
          </Button>
        </View>
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
    paddingBottom: 120,
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

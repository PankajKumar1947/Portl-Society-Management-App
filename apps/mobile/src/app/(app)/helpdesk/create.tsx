import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
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
  { label: "Maintenance", value: "maintenance" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
  { label: "Security", value: "security" },
  { label: "Other", value: "other" },
];

export default function RaiseTicketScreen() {
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
    // Navigate back to the index screen
    router.replace(Routes.Helpdesk.Index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Raise New Ticket"
          onBack={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormSelect
              name="category"
              label="Category"
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="subject"
              label="Subject"
              placeholder="Brief description"
              required
            />

            <View style={styles.fieldGap} />

            <FormTextArea
              name="description"
              label="Description"
              placeholder="Describe your issue"
              required
              maxLength={500}
            />

            <View style={styles.fieldGap} />

            <Text style={styles.attachmentLabel}>Attachments</Text>
            <AttachmentPicker
              attachments={attachments}
              onAdd={(item) => setAttachments((prev) => [...prev, item])}
              onRemove={(index) => setAttachments((prev) => prev.filter((_, i) => i !== index))}
            />
          </FormProvider>

          <View style={styles.bottomGap} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            Submit Ticket
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
  attachmentLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bottomGap: {
    height: 40,
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

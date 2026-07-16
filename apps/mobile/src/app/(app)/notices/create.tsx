import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextArea } from "@/components/ui/form-textarea";
import { DocumentPicker } from "@/components/ui/document-picker";

interface FileAttachment {
  title: string;
  size: string;
}

export default function CreateNoticeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [attachments, setAttachments] = useState<FileAttachment[]>([
    { title: "Notice_Template.pdf", size: "1.2 MB" },
  ]);

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const onSubmit = () => {
    router.push(Routes.Notices.Index);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Create Notice"
          onBack={() => router.push(Routes.Notices.Index)}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormInput
              name="title"
              label="Notice Title"
              placeholder="Enter notice title"
              required
            />

            <View style={styles.fieldGap} />

            <FormTextArea
              name="description"
              label="Description"
              placeholder="Describe the notice in detail"
              required
              maxLength={500}
            />

            <View style={styles.fieldGap} />

            <Text style={styles.sectionLabel}>Attachments</Text>
            <DocumentPicker
              files={attachments.map((f) => ({ name: f.title, size: f.size }))}
              onAdd={(file) => setAttachments((prev) => [...prev, { title: file.name, size: file.size }])}
              onRemove={(index) => setAttachments((prev) => prev.filter((_, i) => i !== index))}
            />
          </FormProvider>

          <View style={styles.buttonRow}>
            <Button
              variant="outline"
              style={styles.draftButton}
              onPress={() => router.back()}
            >
              Save as Draft
            </Button>
            <Button
              style={styles.publishButton}
              onPress={methods.handleSubmit(onSubmit)}
            >
              Publish
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  draftButton: {
    flex: 1,
    height: 52,
  },
  publishButton: {
    flex: 1,
    height: 52,
  },
});

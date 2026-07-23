import React, { useLayoutEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import NoticeForm from "./_components/notice-form";
import { useCreateNotice } from "@repo/operations";
import { CreateNoticeBody } from "@repo/schema";

export default function CreateNoticeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const { mutate: createNotice, isPending } = useCreateNotice();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: CreateNoticeBody) => {
    const payload = { ...values, status: "published" as const };
    createNotice(payload, {
      onSuccess: () => router.push(Routes.Notices.Index),
    });
  };

  const handleSaveDraft = (values: CreateNoticeBody) => {
    const payload = { ...values, status: "draft" as const };
    createNotice(payload, {
      onSuccess: () => router.push(Routes.Notices.Index),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Create Notice" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <NoticeForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitButtonText="Publish"
            showSaveDraftButton
            onSaveDraft={handleSaveDraft}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
});

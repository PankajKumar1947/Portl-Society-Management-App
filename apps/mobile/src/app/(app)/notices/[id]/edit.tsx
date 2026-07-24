import React, { useLayoutEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import NoticeForm from "../_components/notice-form";
import { useGetNoticeDetail, useUpdateNotice, useAccessControl } from "@repo/operations";
import { UpdateNoticeBody, AclResource } from "@repo/schema";

export default function EditNoticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: notice, isLoading: isLoadingNotice } = useGetNoticeDetail(id ?? "", { enabled: !!id });
  const { mutate: updateNotice, isPending } = useUpdateNotice(id ?? "");
  const { canUpdate } = useAccessControl(AclResource.NOTICES);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: UpdateNoticeBody) => {
    updateNotice(values, {
      onSuccess: () => router.back(),
    });
  };

  if (isLoadingNotice) {
    return <LoadingScreen title="Edit Notice" onBack={() => router.back()} />;
  }

  if (!notice) {
    return <NotFoundScreen title="Edit Notice" message="Notice not found" onBack={() => router.back()} />;
  }

  if (!canUpdate) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Edit Notice" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  const initialValues: Partial<UpdateNoticeBody> = {
    title: notice.title,
    recipient: notice.recipient,
    description: notice.description,
    towerIds: notice.towerIds,
    attachments: notice.attachments,
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Notice" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <NoticeForm
            initialValues={initialValues}
            initialMedia={notice.attachmentList}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitButtonText="Save"
            onCancel={() => router.back()}
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

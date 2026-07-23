import React, { useLayoutEffect, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormMultiSelect } from "@/components/ui/form-multi-select";
import { FormTextArea } from "@/components/ui/form-textarea";
import { DocumentPicker } from "@/components/ui/document-picker";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { useGetNoticeDetail, useUpdateNotice, useGetTowers } from "@repo/operations";
import { UpdateNoticeBody, RECIPIENT_OPTIONS } from "@repo/schema";

interface FileAttachment {
  title: string;
  size: string;
}

export default function EditNoticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [allTowers, setAllTowers] = useState(true);

  const { data: notice, isLoading: isLoadingNotice } = useGetNoticeDetail(id ?? "", { enabled: !!id });
  const { mutate: updateNotice, isPending } = useUpdateNotice(id ?? "");
  const { data: towers } = useGetTowers();

  const towerOptions = useMemo(() => {
    if (!towers) return [];
    return towers.map((t) => ({ label: t.towerName, value: t.towerId }));
  }, [towers]);

  const methods = useForm<UpdateNoticeBody>({
    defaultValues: {
      title: "",
      recipient: [],
      description: "",
      towerIds: [],
    },
  });

  useEffect(() => {
    if (notice) {
      const hasTowerSelection = notice.towerIds && notice.towerIds.length > 0;
      setAllTowers(!hasTowerSelection);
      methods.reset({
        title: notice.title,
        recipient: notice.recipient ?? [],
        description: notice.description,
        towerIds: notice.towerIds ?? [],
      });
    }
  }, [notice, methods]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const onSubmit = (values: UpdateNoticeBody) => {
    const payload: UpdateNoticeBody = {
      title: values.title,
      recipient: values.recipient,
      description: values.description,
    };
    if (!allTowers) {
      payload.towerIds = values.towerIds;
    } else {
      payload.towerIds = [];
    }
    updateNotice(payload, {
      onSuccess: () => router.back(),
    });
  };

  if (isLoadingNotice) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Edit Notice" onBack={() => router.back()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!notice) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Edit Notice" onBack={() => router.back()} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Notice not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        >
          <FormProvider {...methods}>
            <FormInput
              name="title"
              label="Notice Title"
              placeholder="Enter notice title"
              required
            />

            <View style={styles.fieldGap} />

            <FormMultiSelect
              name="recipient"
              label="Recipient"
              options={RECIPIENT_OPTIONS}
              placeholder="Select recipient groups"
              required
            />

            <View style={styles.fieldGap} />

            <ToggleSwitch
              label="All Towers"
              description="Send to all towers in the society"
              value={allTowers}
              onChange={setAllTowers}
            />

            {!allTowers && (
              <>
                <View style={styles.fieldGap} />
                <FormMultiSelect
                  name="towerIds"
                  label="Select Towers"
                  options={towerOptions}
                  placeholder="Choose specific towers"
                />
              </>
            )}

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
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              style={styles.saveButton}
              onPress={methods.handleSubmit(onSubmit)}
              disabled={isPending}
              loading={isPending}
            >
              Save Changes
            </Button>
          </View>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
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
  cancelButton: {
    flex: 1,
    height: 52,
  },
  saveButton: {
    flex: 1,
    height: 52,
  },
});

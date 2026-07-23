import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { theme } from "@/constants";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormMultiSelect } from "@/components/ui/form-multi-select";
import { FormTextArea } from "@/components/ui/form-textarea";
import { MediaUploader } from "@/components/common/media-uploader";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { useGetTowers } from "@repo/operations";
import { CreateNoticeBody, RECIPIENT_OPTIONS, MediaPurposes, EntityTypes, MediaData } from "@repo/schema";

interface NoticeFormProps {
  initialValues?: Partial<CreateNoticeBody>;
  onSubmit: (values: CreateNoticeBody) => void;
  isSubmitting: boolean;
  initialMedia?: MediaData[];
  submitButtonText?: string;
  onCancel?: () => void;
  showSaveDraftButton?: boolean;
  onSaveDraft?: (values: CreateNoticeBody) => void;
}

export default function NoticeForm({
  initialValues,
  onSubmit,
  isSubmitting,
  initialMedia = [],
  submitButtonText = "Save",
  onCancel,
  showSaveDraftButton = false,
  onSaveDraft,
}: NoticeFormProps) {
  const [allTowers, setAllTowers] = useState(
    !initialValues?.towerIds || initialValues.towerIds.length === 0,
  );

  const { data: towers } = useGetTowers();

  const towerOptions = useMemo(() => {
    if (!towers) return [];
    return towers.map((t) => ({ label: t.towerName, value: t.towerId }));
  }, [towers]);

  const methods = useForm<CreateNoticeBody>({
    defaultValues: {
      title: initialValues?.title || "",
      recipient: initialValues?.recipient || [],
      description: initialValues?.description || "",
      towerIds: initialValues?.towerIds || [],
      attachments: initialValues?.attachments || [],
    },
  });

  const buildPayload = (values: CreateNoticeBody): CreateNoticeBody => {
    const payload: CreateNoticeBody = {
      title: values.title,
      recipient: values.recipient,
      description: values.description,
      attachments: values.attachments || [],
      status: values.status,
    };
    if (!allTowers) {
      payload.towerIds = values.towerIds;
    } else {
      payload.towerIds = [];
    }
    return payload;
  };

  const handleFormSubmit = (values: CreateNoticeBody) => {
    onSubmit(buildPayload(values));
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const values = methods.getValues();
      onSaveDraft(buildPayload(values));
    }
  };

  return (
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
      <MediaUploader
        purpose={MediaPurposes.NOTICE_ATTACHMENT}
        entityType={EntityTypes.NOTICES}
        initialMedia={initialMedia}
        onChange={(ids) => methods.setValue("attachments", ids)}
      />

      <View style={styles.buttonRow}>
        {showSaveDraftButton && onSaveDraft ? (
          <Button
            variant="outline"
            style={styles.actionButton}
            onPress={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
        ) : (
          onCancel && (
            <Button
              variant="outline"
              style={styles.actionButton}
              onPress={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )
        )}
        <Button
          style={styles.actionButton}
          onPress={methods.handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
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
  actionButton: {
    flex: 1,
    height: 52,
  },
});

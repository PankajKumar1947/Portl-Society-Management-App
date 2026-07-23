import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { AttachmentPicker, AttachmentItem } from "../ui/attachment-picker";
import { useUploadMedia, useDeleteMedia } from "@repo/operations";
import { MediaPurpose, EntityType, MediaData } from "@repo/schema";
import { theme } from "../../constants";

export interface MediaUploaderProps {
  purpose: MediaPurpose;
  entityType: EntityType;
  entityId?: string;
  initialMedia?: MediaData[];
  onChange?: (mediaIds: string[]) => void;
  maxFiles?: number;
}

interface UploadingState {
  name: string;
  progress: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  purpose,
  entityType,
  entityId,
  initialMedia = [],
  onChange,
  maxFiles = 5,
}) => {
  const [uploadedMedia, setUploadedMedia] = useState<MediaData[]>(initialMedia);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingState[]>([]);

  const { mutateAsync: uploadMedia } = useUploadMedia();
  const { mutateAsync: deleteMedia } = useDeleteMedia();

  const handleAddAttachment = async (item: AttachmentItem) => {
    const uploadState = { name: item.name, progress: true };
    setUploadingFiles((prev) => [...prev, uploadState]);

    try {
      const filePayload = {
        uri: item.uri,
        name: item.name,
        type: item.type === "image" ? "image/jpeg" : "application/octet-stream",
      };

      const res = await uploadMedia({
        file: filePayload,
        purpose,
        entityType,
        entityId,
      });

      if (res.success && res.data) {
        const updated = [...uploadedMedia, res.data];
        setUploadedMedia(updated);
        onChange?.(updated.map((m) => m.mediaId));
      }
    } catch (error) {
      // Handled silently
    } finally {
      setUploadingFiles((prev) => prev.filter((f) => f.name !== item.name));
    }
  };

  const handleRemoveAttachment = async (index: number) => {
    const target = uploadedMedia[index];
    if (!target) return;

    try {
      await deleteMedia(target.mediaId);
      const updated = uploadedMedia.filter((_, i) => i !== index);
      setUploadedMedia(updated);
      onChange?.(updated.map((m) => m.mediaId));
    } catch (error) {
      // Deletion error
    }
  };

  const attachments: AttachmentItem[] = uploadedMedia.map((m) => ({
    uri: m.url,
    name: m.fileName,
    type: m.mimeType.startsWith("image/") ? "image" : "document",
    size: m.sizeBytes ? `${(m.sizeBytes / 1024).toFixed(1)} KB` : undefined,
  }));

  return (
    <View style={styles.container}>
      <AttachmentPicker
        attachments={attachments}
        onAdd={handleAddAttachment}
        onRemove={handleRemoveAttachment}
        maxAttachments={maxFiles}
      />

      {uploadingFiles.length > 0 && (
        <View style={styles.uploadingContainer}>
          {uploadingFiles.map((file, idx) => (
            <View key={idx} style={styles.progressRow}>
              <ActivityIndicator size="small" color={theme.colors.primaryDark} />
              <Text style={styles.uploadingText} numberOfLines={1}>
                Uploading {file.name}...
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  uploadingContainer: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.md,
  },
  uploadingText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});

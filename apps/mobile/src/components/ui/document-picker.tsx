import React, { useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoDocumentPicker from "expo-document-picker";
import { theme } from "../../constants";
import { Card } from "./card";

export interface PickedFile {
  name: string;
  size: string;
  uri?: string;
  mimeType?: string;
}

export interface DocumentPickerProps {
  files: PickedFile[];
  onAdd?: (file: PickedFile) => void;
  onRemove?: (index: number) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string): keyof typeof Ionicons.glyphMap {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "document-text-outline";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return "image-outline";
    case "doc":
    case "docx":
      return "document-outline";
    case "xls":
    case "xlsx":
      return "grid-outline";
    default:
      return "document-attach-outline";
  }
}

export const DocumentPicker: React.FC<DocumentPickerProps> = ({
  files,
  onAdd,
  onRemove,
}) => {
  const handlePick = useCallback(async () => {
    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        onAdd?.({
          name: asset.name,
          size: formatSize(asset.size ?? 0),
          uri: asset.uri,
          mimeType: asset.mimeType ?? undefined,
        });
      }
    } catch {
      Alert.alert("Error", "Could not open document picker");
    }
  }, [onAdd]);

  return (
    <View style={styles.container}>
      {files.map((file, index) => (
        <Card key={index} variant="flat" style={styles.fileRow}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={getFileIcon(file.name)}
              size={20}
              color={theme.colors.primaryDark}
            />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.fileSize}>{file.size}</Text>
          </View>
          {onRemove && (
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textMuted}
              onPress={() => onRemove(index)}
            />
          )}
        </Card>
      ))}

      {onAdd && (
        <Card variant="flat" style={styles.addCard} onPress={handlePick}>
          <Ionicons
            name="cloud-upload-outline"
            size={24}
            color={theme.colors.primaryDark}
          />
          <Text style={styles.addText}>Tap to add files</Text>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  fileSize: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  addText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default DocumentPicker;

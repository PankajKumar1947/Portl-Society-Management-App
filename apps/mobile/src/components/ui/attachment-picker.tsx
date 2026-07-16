import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoImagePicker from "expo-image-picker";
import * as ExpoDocumentPicker from "expo-document-picker";
import { theme } from "../../constants";
import Card from "./card";

export interface AttachmentItem {
  uri: string;
  name: string;
  type: "image" | "document";
  size?: string;
}

export interface AttachmentPickerProps {
  attachments: AttachmentItem[];
  onAdd: (item: AttachmentItem) => void;
  onRemove: (index: number) => void;
  maxAttachments?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const AttachmentPicker: React.FC<AttachmentPickerProps> = ({
  attachments,
  onAdd,
  onRemove,
  maxAttachments = 5,
}) => {
  const handleLaunchCamera = useCallback(async () => {
    if (attachments.length >= maxAttachments) {
      Alert.alert("Limit reached", `Maximum ${maxAttachments} attachments allowed.`);
      return;
    }

    const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your camera to take photos.");
      return;
    }

    try {
      const result = await ExpoImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const fileName = asset.uri.split("/").pop() || "camera_photo.jpg";
        onAdd({
          uri: asset.uri,
          name: fileName,
          type: "image",
        });
      }
    } catch {
      Alert.alert("Error", "Could not open camera");
    }
  }, [attachments.length, maxAttachments, onAdd]);

  const handlePickLibrary = useCallback(async () => {
    if (attachments.length >= maxAttachments) {
      Alert.alert("Limit reached", `Maximum ${maxAttachments} attachments allowed.`);
      return;
    }

    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your photo library to select photos.");
      return;
    }

    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        for (const asset of result.assets) {
          if (attachments.length >= maxAttachments) {
            Alert.alert("Limit reached", `Maximum ${maxAttachments} attachments allowed.`);
            break;
          }
          const fileName = asset.uri.split("/").pop() || "photo.jpg";
          onAdd({
            uri: asset.uri,
            name: fileName,
            type: "image",
          });
        }
      }
    } catch {
      Alert.alert("Error", "Could not open photo library");
    }
  }, [attachments.length, maxAttachments, onAdd]);

  const handlePickDocument = useCallback(async () => {
    if (attachments.length >= maxAttachments) {
      Alert.alert("Limit reached", `Maximum ${maxAttachments} attachments allowed.`);
      return;
    }

    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        onAdd({
          uri: asset.uri,
          name: asset.name,
          type: "document",
          size: formatSize(asset.size ?? 0),
        });
      }
    } catch {
      Alert.alert("Error", "Could not open document picker");
    }
  }, [attachments.length, maxAttachments, onAdd]);

  return (
    <View style={styles.container}>
      {/* Upload buttons */}
      <View style={styles.photoRow}>
        <TouchableOpacity style={styles.photoButton} activeOpacity={0.7} onPress={handleLaunchCamera}>
          <Ionicons name="camera-outline" size={28} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} activeOpacity={0.7} onPress={handlePickLibrary}>
          <Ionicons name="image-outline" size={28} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton} activeOpacity={0.7} onPress={handlePickDocument}>
          <Ionicons name="document-text-outline" size={28} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Attachments preview list */}
      {attachments.length > 0 && (
        <View style={styles.previewList}>
          {attachments.map((item, index) => {
            if (item.type === "image") {
              return (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: item.uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeOverlay}
                    activeOpacity={0.8}
                    onPress={() => onRemove(index)}
                  >
                    <Ionicons name="close" size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <Card key={index} variant="flat" style={styles.fileRow}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="document-text-outline" size={20} color={theme.colors.primaryDark} />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.size && <Text style={styles.fileSize}>{item.size}</Text>}
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => onRemove(index)}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  photoRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  photoButton: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  previewList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
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
});

export default AttachmentPicker;

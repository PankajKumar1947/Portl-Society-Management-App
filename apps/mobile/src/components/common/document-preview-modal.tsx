import React, { useState } from "react";
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { theme } from "../../constants";
import Button from "../ui/button";
import { useAlert } from "../../context/alert-context";

export interface DocumentPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  mimeType: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  onClose,
  fileUrl,
  fileName,
  mimeType,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { showAlert } = useAlert();
  const isImage = mimeType.startsWith("image/");

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const downloadedFile = await File.downloadFileAsync(fileUrl, Paths.document, {
        idempotent: true,
      });

      if (isImage) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.createAssetAsync(downloadedFile.uri);
          showAlert({
            title: "Success",
            description: "Image saved successfully to your photo gallery!",
            variant: "success",
          });
          onClose();
          return;
        }
      }

      try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(downloadedFile.uri);
          return;
        }
      } catch (nativeError) {
        // Safe empty catch for native sharing availability check
      }

      await Linking.openURL(fileUrl);
    } catch (error) {
      try {
        await Linking.openURL(fileUrl);
      } catch (err) {
        showAlert({
          title: "Error",
          description: "Could not save document.",
          variant: "error",
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const downloadedFile = await File.downloadFileAsync(fileUrl, Paths.document, {
        idempotent: true,
      });

      try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(downloadedFile.uri);
          return;
        }
      } catch (nativeError) {
        // Safe empty catch for native sharing availability check
      }
      await Linking.openURL(fileUrl);
    } catch (error) {
      showAlert({
        title: "Error",
        description: "Could not share document.",
        variant: "error",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {fileName}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isDownloading || isSharing}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.previewBody}>
            {isImage ? (
              <Image
                source={{ uri: fileUrl }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.fallbackContainer}>
                <Ionicons
                  name={mimeType.includes("pdf") ? "document-text-outline" : "document-attach-outline"}
                  size={64}
                  color={theme.colors.primaryDark}
                />
                <Text style={styles.fallbackText}>
                  Preview not available in-app for this format.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Button
              variant="outline"
              style={styles.button}
              onPress={handleDownload}
              loading={isDownloading}
              disabled={isDownloading || isSharing}
            >
              Download
            </Button>
            <Button
              style={styles.button}
              onPress={handleShare}
              loading={isSharing}
              disabled={isDownloading || isSharing}
            >
              Share
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  previewBody: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  fallbackContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  fallbackText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: theme.fontWeights.medium,
  },
  footer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    height: 48,
  },
});

export default DocumentPreviewModal;

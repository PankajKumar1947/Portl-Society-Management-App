import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Avatar } from "@/components/ui/avatar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ui/screen-header";
import { Modal } from "@/components/ui/modal";
import * as ExpoImagePicker from "expo-image-picker";
import { useCreateSocialsPost, useUploadMedia } from "@repo/operations";

export default function NewPostScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { mutate: createPost, isPending } = useCreateSocialsPost();
  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () => {
      parent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const handlePickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit Reached", "You can upload up to 4 images only.");
      return;
    }

    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your photo library to select photos.");
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileUri = asset.uri;
      const filename = fileUri.split("/").pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      uploadMedia(
        {
          file: { uri: fileUri, name: filename, type },
          purpose: "FEEDS",
          entityType: "feeds",
        },
        {
          onSuccess: (res) => {
            if (res.data && res.data.url) {
              setImages([...images, res.data.url]);
            }
          },
        }
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handlePublish = () => {
    if (!content.trim() && images.length === 0) {
      Alert.alert("Empty Post", "Please write some text or attach an image.");
      return;
    }
    setConfirmModalVisible(true);
  };

  const executePublish = () => {
    setConfirmModalVisible(false);
    createPost(
      { content, images },
      {
        onSuccess: () => {
          setSuccessModalVisible(true);
        },
      }
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { marginBottom: -(60 + (insets.bottom > 0 ? insets.bottom : 8)) }]} edges={["top", "left", "right"]}>
      <ScreenHeader
        title="Create Post"
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity
            style={[styles.publishButton, (!content.trim() && images.length === 0) && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={isPending || (!content.trim() && images.length === 0)}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.publishButtonText}>Publish</Text>
            )}
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* User profile preview */}
          <View style={styles.userRow}>
            <Avatar name="Pankaj Kumar" size="md" />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Pankaj Kumar</Text>
              <View style={styles.roleBadge}>
                <Ionicons name="people" size={12} color={theme.colors.primary} />
                <Text style={styles.roleText}>Admin · Flat 303</Text>
              </View>
            </View>
          </View>

          {/* Images Section at the Top */}
          <View style={styles.topImagesContainer}>
            {images.length === 0 ? (
              <TouchableOpacity
                style={styles.uploadPlaceholder}
                onPress={handlePickImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={32} color={theme.colors.primary} />
                    <Text style={styles.uploadPlaceholderText}>Add Photos ({images.length}/4)</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.imagesSection}>
                <View style={styles.imagesHeaderRow}>
                  <Text style={styles.sectionTitle}>Attached Photos ({images.length}/4)</Text>
                  {images.length < 4 && (
                    <TouchableOpacity
                      style={styles.addMoreBtn}
                      onPress={handlePickImage}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                      ) : (
                        <>
                          <Ionicons name="add-circle" size={18} color={theme.colors.primary} />
                          <Text style={styles.addMoreText}>Add more</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                  {images.map((url, idx) => (
                    <View key={idx} style={styles.imageContainer}>
                      <Image source={{ uri: url }} style={styles.attachedImage} />
                      <TouchableOpacity style={styles.removeImageBtn} onPress={() => handleRemoveImage(idx)}>
                        <Ionicons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Text Editor below */}
          <TextInput
            style={styles.editorInput}
            placeholder="What's happening in your society? Share updates, requests, or questions..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={1000}
          />
        </ScrollView>

        {/* Floating Media Actions Bar */}
        <View style={styles.actionsBar}>
          <Text style={styles.actionsBarLabel}>Add to your post</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handlePickImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={24} color={theme.colors.primary} />
                  <Text style={styles.actionBtnText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Polls", "Poll creation is coming soon!")}>
              <Ionicons name="bar-chart-outline" size={24} color="#2e7d32" />
              <Text style={styles.actionBtnText}>Create Poll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Modal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="Publish Post"
        description="Are you sure you want to share this post with your society neighbors?"
        confirmLabel="Publish Now"
        onConfirm={executePublish}
        confirmVariant="primary"
        cancelLabel="Cancel"
      />
      <Modal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          router.back();
        }}
        title="Post Published"
        description="Your post has been successfully shared with the society members."
        confirmLabel="Go back to Socials"
        onConfirm={() => {
          setSuccessModalVisible(false);
          router.back();
        }}
        confirmVariant="success"
        cancelLabel=""
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  publishButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  publishButtonText: {
    color: "#fff",
    fontWeight: theme.fontWeights.semibold,
    fontSize: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    marginLeft: theme.spacing.md,
  },
  userName: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.primary}12`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    fontSize: 11,
    color: theme.colors.primary,
    marginLeft: 4,
    fontWeight: theme.fontWeights.medium,
  },
  editorInput: {
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 150,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  topImagesContainer: {
    marginBottom: theme.spacing.md,
  },
  uploadPlaceholder: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: `${theme.colors.primary}40`,
    backgroundColor: `${theme.colors.primary}05`,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlaceholderText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
    marginTop: 6,
  },
  imagesHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  addMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  addMoreText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
    marginLeft: 4,
  },
  imagesSection: {
    paddingVertical: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  imagesScroll: {
    flexDirection: "row",
  },
  imageContainer: {
    position: "relative",
    marginRight: theme.spacing.md,
  },
  attachedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsBar: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionsBarLabel: {
    fontSize: 13,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: theme.spacing.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionBtnText: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 6,
    fontWeight: theme.fontWeights.medium,
  },
});

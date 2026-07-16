import React, { useCallback } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoImagePicker from "expo-image-picker";
import { theme } from "../../constants";
import { Card } from "./card";

export interface GalleryImage {
  uri: string;
  id?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  onAdd?: (image: GalleryImage) => void;
  onRemove?: (index: number) => void;
  maxImages?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onAdd,
  onRemove,
  maxImages = 10,
}) => {
  const handlePick = useCallback(async () => {
    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your photo library to add images.");
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      for (const asset of result.assets) {
        if (images.length + (onAdd ? 1 : 0) >= maxImages) {
          Alert.alert("Limit reached", `Maximum ${maxImages} images allowed.`);
          break;
        }
        onAdd?.({ uri: asset.uri });
      }
    }
  }, [images.length, maxImages, onAdd]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {images.map((image, index) => (
          <View key={image.id ?? index} style={styles.imageWrapper}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            {onRemove && (
              <View style={styles.removeOverlay}>
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={theme.colors.danger}
                  onPress={() => onRemove(index)}
                />
              </View>
            )}
          </View>
        ))}

        {onAdd && images.length < maxImages && (
          <Card variant="flat" style={styles.addCard} onPress={handlePick}>
            <Ionicons name="camera-outline" size={28} color={theme.colors.primaryDark} />
            <Text style={styles.addText}>Add Photo</Text>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
    overflow: "hidden",
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
    borderRadius: 11,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  addCard: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    backgroundColor: "transparent",
    borderRadius: theme.radius.md,
  },
  addText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
});

export default ImageGallery;

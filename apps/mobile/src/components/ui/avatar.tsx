import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle, ImageStyle } from "react-native";
import { theme } from "../../constants";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
};

const FONT_SIZES: Record<AvatarSize, number> = {
  xs: 10,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
};

export interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = "md",
  style,
}) => {
  const dim = SIZES[size];
  const radius = dim / 2;
  const fontSize = FONT_SIZES[size];

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const sizeStyle: ViewStyle = { width: dim, height: dim, borderRadius: radius };

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image as ImageStyle,
          { width: dim, height: dim, borderRadius: radius } as ImageStyle,
          style as ImageStyle,
        ]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.fallback, sizeStyle, style]}>
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fallback: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
  },
});

export default Avatar;

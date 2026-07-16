import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import { Card } from "./card";
import { IconButton } from "./icon-button";

export interface FileCardProps {
  title: string;
  size: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onMorePress?: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  title,
  size,
  icon = "document-text-outline",
  onMorePress,
}) => {
  return (
    <Card variant="flat" style={styles.card}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color={theme.colors.primaryDark} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.size}>{size}</Text>
      </View>
      <IconButton
        onPress={onMorePress ?? (() => {})}
        icon={<Ionicons name="ellipsis-vertical" size={18} color={theme.colors.textMuted} />}
        variant="ghost"
        size="sm"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
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
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  size: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
});

export default FileCard;

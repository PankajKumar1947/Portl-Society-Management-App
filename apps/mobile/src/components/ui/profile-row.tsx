import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";

export interface ProfileRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showBorder?: boolean;
}

export const ProfileRow: React.FC<ProfileRowProps> = ({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
  showBorder = true,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.row, !showBorder && styles.noBorder]}
    >
      <View style={styles.leftInfo}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={22} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.rowTitle}>{title}</Text>
          {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.rightInfo}>
        {rightElement !== undefined ? (
          rightElement
        ) : (
          onPress && <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        )}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    flex: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  rowSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  rightInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
});

export default ProfileRow;

import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { theme } from "../../constants";

export interface BadgeProps {
  children: string;
  variant?: "success" | "warning" | "danger" | "info" | "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  style,
  textStyle,
}) => {
  const getBadgeStyle = (): ViewStyle[] => {
    return [styles.badge, styles[variant], style || {}];
  };

  const getTextStyle = (): TextStyle[] => {
    return [styles.text, styles[`${variant}Text` as keyof typeof styles] as TextStyle, textStyle || {}];
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm * 1.5,
    paddingVertical: theme.spacing.xs * 1.5,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  // Variant styles
  primary: {
    backgroundColor: theme.colors.primaryLight,
  },
  primaryText: {
    color: theme.colors.primaryDark,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
  },
  success: {
    backgroundColor: "#E8F9EE",
  },
  successText: {
    color: theme.colors.success,
  },
  warning: {
    backgroundColor: "#FFF3E0",
  },
  warningText: {
    color: theme.colors.warning,
  },
  danger: {
    backgroundColor: "#FFEBEB",
  },
  dangerText: {
    color: theme.colors.danger,
  },
  info: {
    backgroundColor: "#EAF4FF",
  },
  infoText: {
    color: theme.colors.info,
  },
});

export default Badge;

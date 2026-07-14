import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../../constants";

export interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = (): ViewStyle[] => {
    const baseStyle = styles.button;
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];
    const stylesArray: ViewStyle[] = [baseStyle, variantStyle, sizeStyle];

    if (disabled) {
      stylesArray.push(styles.disabled);
    }
    if (style) {
      stylesArray.push(style);
    }
    return stylesArray;
  };

  const getTextStyles = (): TextStyle[] => {
    const baseTextStyle = styles.text;
    const variantTextStyle = styles[`${variant}Text` as keyof typeof styles] as TextStyle;
    const sizeTextStyle = styles[`${size}Text` as keyof typeof styles] as TextStyle;
    const stylesArray: TextStyle[] = [baseTextStyle, variantTextStyle, sizeTextStyle];

    if (disabled) {
      stylesArray.push(styles.disabledText);
    }
    if (textStyle) {
      stylesArray.push(textStyle);
    }
    return stylesArray;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={getButtonStyles()}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? theme.colors.text : theme.colors.primary}
        />
      ) : (
        <Text style={getTextStyles()}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
  },
  primaryText: {
    color: theme.colors.text,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
  },
  outlineText: {
    color: theme.colors.textSecondary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: theme.colors.textSecondary,
  },
  // Sizes
  sm: {
    paddingVertical: theme.spacing.xs * 2,
    paddingHorizontal: theme.spacing.sm * 2,
  },
  smText: {
    fontSize: 14,
  },
  md: {
    paddingVertical: theme.spacing.sm * 1.5,
    paddingHorizontal: theme.spacing.md * 2,
  },
  mdText: {
    fontSize: 16,
  },
  lg: {
    paddingVertical: theme.spacing.md * 1.25,
    paddingHorizontal: theme.spacing.lg * 2,
    height: 56,
  },
  lgText: {
    fontSize: 18,
    fontWeight: "700",
  },
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

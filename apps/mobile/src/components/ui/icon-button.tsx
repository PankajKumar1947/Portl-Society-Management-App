import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from "react-native";
import { theme } from "../../constants";

export interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: "filled" | "outline" | "ghost" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  variant = "filled",
  size = "md",
  style,
  disabled = false,
}) => {
  const getButtonStyles = () => {
    const baseStyle = styles.button;
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];

    const stylesArray: ViewStyle[] = [baseStyle, variantStyle, sizeStyle];

    // Apply shadow only to filled, primary, or secondary variants
    if (variant === "filled" || variant === "primary" || variant === "secondary") {
      stylesArray.push(styles.shadow);
    }

    if (disabled) {
      stylesArray.push(styles.disabled);
    }

    if (style) {
      stylesArray.push(style);
    }

    return stylesArray;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={getButtonStyles()}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Variants
  filled: {
    backgroundColor: theme.colors.surface,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  // Sizes
  sm: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  md: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  lg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  // Shadows
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;

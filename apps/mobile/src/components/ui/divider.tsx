import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../constants";

export interface DividerProps {
  style?: ViewStyle;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  color?: string;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  orientation = "horizontal",
  thickness = 1,
  color = theme.colors.border,
  spacing,
}) => {
  const isHorizontal = orientation === "horizontal";

  const dividerStyle: ViewStyle = {
    backgroundColor: color,
    ...(isHorizontal
      ? {
          height: thickness,
          width: "100%",
          marginVertical: spacing ?? theme.spacing.sm,
        }
      : {
          width: thickness,
          height: "100%",
          marginHorizontal: spacing ?? theme.spacing.sm,
        }),
  };

  return <View style={[dividerStyle, style]} />;
};

export default Divider;

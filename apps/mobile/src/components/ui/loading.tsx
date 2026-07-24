import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../constants";

export interface LoadingProps {
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = theme.colors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;

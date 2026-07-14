import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../../constants";

export interface OnboardingIndicatorProps {
  total: number;
  activeIndex: number;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  total,
  activeIndex,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
};

export default OnboardingIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: theme.colors.border,
  },
});

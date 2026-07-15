import React from "react";
import { View, Text, Switch, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../constants";

export interface ToggleSwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  style?: ViewStyle;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  value,
  onChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.surface}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
  },
  textBlock: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});

export default ToggleSwitch;

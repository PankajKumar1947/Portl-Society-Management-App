import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";

export interface InfoRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  value: string;
  style?: ViewStyle;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={16}
          color={theme.colors.textSecondary}
          style={styles.icon}
        />
      ) : null}
      {label ? <Text style={styles.label}>{label}:</Text> : null}
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: 2,
  },
  icon: {
    marginRight: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
    flex: 1,
  },
});

export default InfoRow;

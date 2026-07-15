import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { theme } from "../../constants";

export interface TypeOption {
  id: string;
  label: string;
}

export interface TypeSelectorProps {
  options: TypeOption[];
  value: string;
  onChange: (id: string) => void;
  style?: ViewStyle;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  options,
  value,
  onChange,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={[styles.option, active && styles.activeOption]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionLabel, active && styles.activeLabel]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  option: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  activeLabel: {
    color: theme.colors.text,
  },
});

export default TypeSelector;

import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { theme } from "../../constants";

export interface FilterTab {
  id: string;
  label: string;
}

export interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  style?: ViewStyle;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, style]}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={[styles.tab, active && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.label}
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  tab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  activeLabel: {
    color: theme.colors.text,
  },
});

export default FilterTabs;

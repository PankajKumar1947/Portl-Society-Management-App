import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { useGetTowers, useAccessControl } from "@repo/operations";
import { AclResource } from "@repo/schema";

interface TowerFilterSectionProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function TowerFilterSection({
  selectedIds,
  onToggle,
}: TowerFilterSectionProps) {
  const { canView } = useAccessControl(AclResource.TOWERS);
  const { data: towers } = useGetTowers({ enabled: !!canView });
  const options = useMemo(() => {
    if (!canView || !towers) return [];
    return towers.map((t) => ({ label: t.towerName, value: t.towerId }));
  }, [towers, canView]);

  if (!canView || options.length === 0) return null;

  return (
    <>
      <View style={styles.filterDivider} />
      <Text style={styles.filterSectionLabel}>Towers</Text>
      {options.map((tower) => {
        const selected = selectedIds.includes(tower.value);
        return (
          <TouchableOpacity
            key={tower.value}
            onPress={() => onToggle(tower.value)}
            style={styles.towerRow}
          >
            <Text style={styles.towerLabel}>{tower.label}</Text>
            <View style={[styles.checkbox, selected && styles.checkboxActive]}>
              {selected && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  filterDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  towerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  towerLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

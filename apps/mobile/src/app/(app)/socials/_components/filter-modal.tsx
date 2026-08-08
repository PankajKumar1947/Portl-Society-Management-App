import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "resident" | "admin" | "guard";

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  roleFilter: FilterType;
  timeRange: string;
  startDate: string;
  endDate: string;
  onApply: (filters: {
    roleFilter: FilterType;
    timeRange: string;
    startDate: string;
    endDate: string;
  }) => void;
  onClear: () => void;
}

export default function FilterModal({
  visible,
  onClose,
  roleFilter,
  timeRange,
  startDate,
  endDate,
  onApply,
  onClear,
}: FilterModalProps) {
  const [tempFilter, setTempFilter] = useState<FilterType>(roleFilter);
  const [tempTimeRange, setTempTimeRange] = useState<string>(timeRange);
  const [tempStartDate, setTempStartDate] = useState<string>(startDate);
  const [tempEndDate, setTempEndDate] = useState<string>(endDate);

  // Sync state with props when modal becomes visible
  useEffect(() => {
    if (visible) {
      setTempFilter(roleFilter);
      setTempTimeRange(timeRange);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  }, [visible, roleFilter, timeRange, startDate, endDate]);

  const handleApply = () => {
    onApply({
      roleFilter: tempFilter,
      timeRange: tempTimeRange,
      startDate: tempStartDate,
      endDate: tempEndDate,
    });
  };

  const handleClear = () => {
    setTempFilter("all");
    setTempTimeRange("all");
    setTempStartDate("");
    setTempEndDate("");
    onClear();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[]}
            ListHeaderComponent={
              <View style={styles.modalBody}>
                <Text style={styles.filterSectionLabel}>Author Role</Text>
                <View style={styles.optionRow}>
                  {[
                    { label: "All Roles", value: "all" },
                    { label: "Residents", value: "resident" },
                    { label: "Admins", value: "admin" },
                    { label: "Guards", value: "guard" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => setTempFilter(opt.value as FilterType)}
                      style={[
                        styles.optionChip,
                        tempFilter === opt.value && styles.optionChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          tempFilter === opt.value && styles.optionChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.filterDivider} />

                <Text style={styles.filterSectionLabel}>Posted</Text>
                <View style={styles.optionRow}>
                  {[
                    { label: "All Time", value: "all" },
                    { label: "Last Hour", value: "hour" },
                    { label: "24 Hours", value: "day" },
                    { label: "7 Days", value: "week" },
                    { label: "Custom Date", value: "custom" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => setTempTimeRange(opt.value)}
                      style={[
                        styles.optionChip,
                        tempTimeRange === opt.value && styles.optionChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          tempTimeRange === opt.value && styles.optionChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {tempTimeRange === "custom" && (
                  <View style={styles.customDateContainer}>
                    <View style={styles.dateInputWrapper}>
                      <Text style={styles.dateInputLabel}>Start Date</Text>
                      <TextInput
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.colors.textMuted}
                        style={styles.dateInput}
                        value={tempStartDate}
                        onChangeText={setTempStartDate}
                      />
                    </View>
                    <View style={styles.dateInputWrapper}>
                      <Text style={styles.dateInputLabel}>End Date</Text>
                      <TextInput
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.colors.textMuted}
                        style={styles.dateInput}
                        value={tempEndDate}
                        onChangeText={setTempEndDate}
                      />
                    </View>
                  </View>
                )}
              </View>
            }
            renderItem={() => null}
          />

          <View style={styles.modalFooter}>
            <Button variant="outline" style={styles.footerButton} onPress={handleClear}>
              Clear
            </Button>
            <Button style={styles.footerButton} onPress={handleApply}>
              Apply
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  optionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  optionChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  optionChipTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },
  filterDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  customDateContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    fontWeight: theme.fontWeights.medium,
  },
  dateInput: {
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  modalFooter: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
    height: 48,
  },
});

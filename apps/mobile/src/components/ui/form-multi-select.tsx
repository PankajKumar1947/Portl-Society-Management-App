import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { theme } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormMultiSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  options: readonly SelectOption[];
  placeholder?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  required,
  options,
  placeholder = "Select options",
  containerStyle,
  labelStyle,
}) => {
  const { control, setValue } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [] }, fieldState: { error } }) => {
        const selectedValues: (string | number)[] = value;

        const selectedLabels = options
          .filter((opt) => selectedValues.includes(opt.value))
          .map((opt) => opt.label);

        const handleToggle = (optionValue: string | number) => {
          const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];
          setValue(name, newValue, { shouldValidate: true });
        };

        return (
          <View style={[styles.container, containerStyle]}>
            {label && (
              <Text style={[styles.label, labelStyle]}>
                {label} {required && <Text style={styles.required}>*</Text>}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
              style={[
                styles.selectButton,
                modalVisible && styles.selectButtonActive,
                error && styles.selectButtonError,
              ]}
            >
              <View style={styles.selectContent}>
                {selectedLabels.length > 0 ? (
                  <View style={styles.chipRow}>
                    {selectedLabels.map((label, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={styles.chipText}>{label}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>{placeholder}</Text>
                )}
              </View>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error.message}</Text>}

            <Modal
              transparent
              visible={modalVisible}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{label || "Select Options"}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <Ionicons name="close-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                      </View>

                      <FlatList
                        data={options}
                        keyExtractor={(item) => item.value.toString()}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                          const isSelected = selectedValues.includes(item.value);
                          return (
                            <TouchableOpacity
                              onPress={() => handleToggle(item.value)}
                              style={[
                                styles.optionItem,
                                isSelected && styles.optionItemActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.optionLabel,
                                  isSelected && styles.optionLabelActive,
                                ]}
                              >
                                {item.label}
                              </Text>
                              <View
                                style={[
                                  styles.checkbox,
                                  isSelected && styles.checkboxActive,
                                ]}
                              >
                                {isSelected && (
                                  <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#fff"
                                  />
                                )}
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs * 1.5,
  },
  required: {
    color: theme.colors.danger,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  selectButtonActive: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  selectButtonError: {
    borderColor: theme.colors.danger,
  },
  selectContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  chip: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeights.medium,
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeights.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    width: "80%",
    maxHeight: "65%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  optionItemActive: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  optionLabel: {
    fontSize: 15,
    color: theme.colors.text,
  },
  optionLabelActive: {
    fontWeight: theme.fontWeights.semibold,
  },
  checkbox: {
    width: 22,
    height: 22,
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

export default FormMultiSelect;

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
  value: string;
}

export interface FormSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  required,
  options,
  placeholder = "Select option",
  containerStyle,
  labelStyle,
}) => {
  const { control, setValue } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        const handleSelect = (optionValue: string) => {
          setValue(name, optionValue, { shouldValidate: true });
          setModalVisible(false);
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
              <Text
                style={[
                  styles.selectText,
                  !selectedOption && styles.placeholderText,
                ]}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
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
                        <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <Ionicons name="close-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                      </View>

                      <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                          const isSelected = item.value === value;
                          return (
                            <TouchableOpacity
                              onPress={() => handleSelect(item.value)}
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
                              {isSelected && (
                                <Ionicons
                                  name="checkmark-outline"
                                  size={20}
                                  color={theme.colors.text}
                                />
                              )}
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
    height: 52,
    paddingHorizontal: theme.spacing.md,
  },
  selectButtonActive: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  selectButtonError: {
    borderColor: theme.colors.danger,
  },
  selectText: {
    color: theme.colors.text,
    fontSize: 15,
  },
  placeholderText: {
    color: theme.colors.textMuted,
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
});

export default FormSelect;

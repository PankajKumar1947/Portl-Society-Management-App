import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { theme } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface FormComboboxProps {
  name: string;
  label?: string;
  required?: boolean;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
  name,
  label,
  required,
  options,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  containerStyle,
  labelStyle,
}) => {
  const { control, setValue } = useFormContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        const handleSelect = (optionValue: string) => {
          setValue(name, optionValue, { shouldValidate: true });
          setModalVisible(false);
          setSearchQuery("");
        };

        const handleClose = () => {
          setModalVisible(false);
          setSearchQuery("");
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
                name="search-outline"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error.message}</Text>}

            <Modal
              transparent
              visible={modalVisible}
              animationType="slide"
              onRequestClose={handleClose}
            >
              <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
                        <TouchableOpacity onPress={handleClose}>
                          <Ionicons name="close-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                      </View>

                      {/* Search Bar */}
                      <View style={styles.searchBarContainer}>
                        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} style={styles.searchIcon} />
                        <TextInput
                          style={styles.searchInput}
                          placeholder={searchPlaceholder}
                          placeholderTextColor={theme.colors.textMuted}
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          autoCapitalize="none"
                        />
                        {searchQuery.length > 0 && (
                          <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                          </TouchableOpacity>
                        )}
                      </View>

                      <FlatList
                        data={filteredOptions}
                        keyExtractor={(item) => item.value}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                          <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No matches found</Text>
                          </View>
                        }
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
    fontWeight: "600",
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
    fontWeight: "500",
  },
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
    paddingBottom: 34,
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
    fontWeight: "700",
    color: theme.colors.text,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.sm,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    height: 44,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: theme.colors.text,
    fontSize: 14,
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
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xxl,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
});

export default FormCombobox;

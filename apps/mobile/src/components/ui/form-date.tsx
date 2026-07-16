import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { theme } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./button";

export interface FormDateProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  mode?: "date" | "time" | "datetime";
  formatDate?: (date: Date) => string;
}

export const FormDate: React.FC<FormDateProps> = ({
  name,
  label,
  required,
  placeholder = "Select date",
  containerStyle,
  labelStyle,
  mode = "date",
  formatDate,
}) => {
  const { control, setValue } = useFormContext();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const defaultFormat = (date: Date) => {
    if (mode === "time") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  };

  const formatter = formatDate || defaultFormat;

  const showDateTimePicker = (currentVal: string | number | Date | null | undefined) => {
    setTempDate(currentVal ? new Date(currentVal) : new Date());
    setShowPicker(true);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value }, fieldState: { error } }) => {
        const displayValue = value ? formatter(new Date(value)) : "";

        const handleAndroidChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
          setShowPicker(false);
          if (event.type === "set" && selectedDate) {
            setValue(name, selectedDate.toISOString(), { shouldValidate: true });
          }
        };

        const handleIOSConfirm = () => {
          setValue(name, tempDate.toISOString(), { shouldValidate: true });
          setShowPicker(false);
        };

        return (
          <View style={[styles.container, containerStyle]}>
            {label && (
              <Text style={[styles.label, labelStyle]}>
                {label} {required && <Text style={styles.required}>*</Text>}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => showDateTimePicker(value)}
              activeOpacity={0.8}
              style={[
                styles.pickerButton,
                showPicker && styles.pickerButtonActive,
                error && styles.pickerButtonError,
              ]}
            >
              <Text
                style={[
                  styles.pickerText,
                  !value && styles.placeholderText,
                ]}
              >
                {displayValue || placeholder}
              </Text>
              <Ionicons
                name={mode === "time" ? "time-outline" : "calendar-outline"}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error.message}</Text>}

            {/* Android Picker */}
            {showPicker && Platform.OS === "android" && (
              <DateTimePicker
                value={tempDate}
                mode={mode}
                display="default"
                onChange={handleAndroidChange}
              />
            )}

            {/* iOS Picker in Modal */}
            {showPicker && Platform.OS === "ios" && (
              <Modal
                transparent
                animationType="slide"
                visible={showPicker}
                onRequestClose={() => setShowPicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity onPress={() => setShowPicker(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleIOSConfirm}>
                        <Text style={styles.confirmText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={tempDate}
                      mode={mode}
                      display="spinner"
                      onChange={(_, d) => d && setTempDate(d)}
                      textColor={theme.colors.text}
                    />
                  </View>
                </View>
              </Modal>
            )}
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
  pickerButton: {
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
  pickerButtonActive: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  pickerButtonError: {
    borderColor: theme.colors.danger,
  },
  pickerText: {
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: 34, // Safe area for iOS
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
  },
  confirmText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
  },
});

export default FormDate;

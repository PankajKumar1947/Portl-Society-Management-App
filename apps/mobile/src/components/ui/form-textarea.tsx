import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { theme } from "../../constants";

export interface FormTextAreaProps extends Omit<TextInputProps, "onChangeText" | "value"> {
  name: string;
  label?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  required,
  containerStyle,
  labelStyle,
  inputStyle,
  placeholder,
  maxLength,
  ...props
}) => {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={[styles.container, containerStyle]}>
          {label && (
            <Text style={[styles.label, labelStyle]}>
              {label} {required && <Text style={styles.required}>*</Text>}
            </Text>
          )}

          <View
            style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
              error && styles.inputWrapperError,
            ]}
          >
            <TextInput
              style={[styles.input, inputStyle]}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value ?? ""}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.textMuted}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              {...props}
            />
          </View>

          {maxLength && (
            <Text style={styles.charCount}>
              {(value ?? "").length}/{maxLength}
            </Text>
          )}

          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
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
  inputWrapper: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    minHeight: 120,
    paddingHorizontal: theme.spacing.md,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  inputWrapperError: {
    borderColor: theme.colors.danger,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: "right",
    marginTop: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeights.medium,
  },
});

export default FormTextArea;

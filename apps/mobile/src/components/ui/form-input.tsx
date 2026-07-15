import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { theme } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

export interface FormInputProps extends Omit<TextInputProps, "onChangeText" | "value"> {
  name: string;
  label?: string;
  required?: boolean;
  showToggle?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  required,
  showToggle = false,
  containerStyle,
  labelStyle,
  inputStyle,
  secureTextEntry,
  placeholder,
  ...props
}) => {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldSecure = secureTextEntry && !isPasswordVisible;

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
              secureTextEntry={shouldSecure}
              autoCapitalize="none"
              {...props}
            />

            {secureTextEntry && showToggle && (
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.toggleButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

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
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs * 1.5,
  },
  required: {
    color: theme.colors.danger,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    height: 52,
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
    height: "100%",
    color: theme.colors.text,
    fontSize: 15,
  },
  toggleButton: {
    padding: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: "500",
  },
});

export default FormInput;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { theme } from "../../constants";

export interface FormPhoneProps extends Omit<TextInputProps, "onChangeText" | "value"> {
  name: string;
  label?: string;
  required?: boolean;
  countryCode?: string;
  onCountryCodePress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export const FormPhone: React.FC<FormPhoneProps> = ({
  name,
  label,
  required,
  countryCode = "+91",
  onCountryCodePress,
  containerStyle,
  labelStyle,
  inputStyle,
  placeholder = "Enter phone number",
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
            {/* Country code prefix button */}
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={onCountryCodePress}
              disabled={!onCountryCodePress}
              activeOpacity={0.7}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <View style={styles.divider} />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, inputStyle]}
              keyboardType="phone-pad"
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value ?? ""}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.textMuted}
              maxLength={15}
              {...props}
            />
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
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.sm,
    height: "100%",
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.xs,
  },
  input: {
    flex: 1,
    height: "100%",
    color: theme.colors.text,
    fontSize: 15,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontWeight: "500",
  },
});

export default FormPhone;

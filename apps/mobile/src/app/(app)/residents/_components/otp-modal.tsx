import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpBody } from "@repo/schema";
import { useVerifyResidentOtp, useResendOtp } from "@repo/operations";
import { theme } from "@/constants";
import Button from "@/components/ui/button";

interface OtpVerificationModalProps {
  visible: boolean;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function OtpVerificationModal({
  visible,
  email,
  onSuccess,
  onClose,
}: OtpVerificationModalProps) {
  const [timerCount, setTimerCount] = useState(60);
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyResidentOtp();
  const { mutate: resendOtp, isPending: resending } = useResendOtp();
  const otpInputRef = useRef<TextInput>(null);

  const otpMethods = useForm<OtpBody>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { control, handleSubmit, reset } = otpMethods;

  // Reset timer and form when modal is visible
  useEffect(() => {
    if (visible) {
      setTimerCount(60);
      reset({ otp: "" });
      setTimeout(() => otpInputRef.current?.focus(), 300);
    }
  }, [visible, reset]);

  // Countdown timer
  useEffect(() => {
    if (!visible || timerCount <= 0) return;
    const interval = setInterval(() => {
      setTimerCount((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerCount, visible]);

  const onVerifyOtp = (data: OtpBody) => {
    verifyOtp(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          Alert.alert("Verified", "User verification successful!");
          onSuccess();
        },
        onError: (err) => {
          Alert.alert("Verification Failed", err.message);
        },
      },
    );
  };

  const handleResend = () => {
    if (timerCount > 0 || !email) return;
    resendOtp(
      { email },
      {
        onSuccess: () => {
          setTimerCount(60);
          Alert.alert("Code Sent", "A new verification code has been sent to the resident's email.");
        },
        onError: (err) => {
          Alert.alert("Error", err.message);
        },
      },
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Verify Resident Account</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to the email address:
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <FormProvider {...otpMethods}>
            <View style={styles.form}>
              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  const val = value || "";
                  return (
                    <View style={styles.otpInputWrapper}>
                      <TextInput
                        ref={otpInputRef}
                        style={styles.hiddenInput}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={val}
                        onChangeText={onChange}
                        caretHidden
                      />
                      <View style={styles.boxesContainer}>
                        {Array(6)
                          .fill(0)
                          .map((_, i) => {
                            const char = val[i] || "";
                            const isFocused = val.length === i;
                            return (
                              <TouchableOpacity
                                key={i}
                                style={[
                                  styles.otpBox,
                                  isFocused && styles.otpBoxFocused,
                                  error && styles.otpBoxError,
                                ]}
                                onPress={() => otpInputRef.current?.focus()}
                                activeOpacity={0.8}
                              >
                                <Text style={styles.otpBoxText}>{char}</Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                      {error && <Text style={styles.errorText}>{error.message}</Text>}
                    </View>
                  );
                }}
              />

              <View style={styles.timerContainer}>
                {timerCount > 0 ? (
                  <Text style={styles.timerText}>
                    Resend code in 00:{timerCount < 10 ? `0${timerCount}` : timerCount}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={resending}>
                    <Text style={styles.resendText}>
                      {resending ? "Sending..." : "Resend code"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonRow}>
                <Button
                  onPress={onClose}
                  variant="outline"
                  style={styles.flexButton}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSubmit(onVerifyOtp)}
                  style={styles.flexButton}
                  disabled={isVerifying}
                  loading={isVerifying}
                >
                  Verify
                </Button>
              </View>
            </View>
          </FormProvider>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    width: "100%",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  emailText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  otpInputWrapper: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxesContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    width: "100%",
  },
  otpBox: {
    width: 44,
    height: 48,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  otpBoxFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  otpBoxError: {
    borderColor: theme.colors.danger,
  },
  otpBoxText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  timerText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  resendText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    width: "100%",
  },
  flexButton: {
    flex: 1,
  },
});

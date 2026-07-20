import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { otpSchema, OtpBody } from "@repo/schema";
import { useVerifyOtp, useResendOtp } from "@repo/operations";
import { useAuth } from "@/context/auth-context";
import { Routes } from "@/constants/routes";
import { theme } from "@/constants";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Images } from "@/assets/images";

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [timerCount, setTimerCount] = useState(60);
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: resending } = useResendOtp();
  const { signIn } = useAuth();

  const otpInputRef = useRef<TextInput>(null);

  const otpMethods = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Countdown timer
  useEffect(() => {
    if (timerCount <= 0) return;
    const interval = setInterval(() => {
      setTimerCount((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerCount]);

  // Focus the hidden input on mount
  useEffect(() => {
    setTimeout(() => otpInputRef.current?.focus(), 200);
  }, []);

  const onVerifyOtp = (data: OtpBody) => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please go back and try again.");
      return;
    }
    verifyOtp(
      { email, otp: data.otp },
      {
        onSuccess: async (res) => {
          await signIn(res.accessToken, res.refreshToken);
          router.replace(Routes.Root);
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
          Alert.alert("Code Sent", "A new verification code has been sent to your email.");
        },
        onError: (err) => {
          Alert.alert("Error", err.message);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Top back navigation header */}
      <View style={styles.navBar}>
        <IconButton
          onPress={() => router.back()}
          icon={<Feather name="chevron-left" size={24} color={theme.colors.text} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={Images.iconFull} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>We've sent a 6-digit code to</Text>
          <Text style={styles.boldSubtitle}>{email ?? "your email"}</Text>
        </View>

        <FormProvider {...otpMethods}>
          <View style={styles.form}>
            <Controller
              control={otpMethods.control}
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

            <Button
              onPress={otpMethods.handleSubmit(onVerifyOtp)}
              style={styles.submitButton}
              disabled={isVerifying}
              loading={isVerifying}
            >
              Verify & Continue
            </Button>
          </View>
        </FormProvider>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  navBar: {
    height: 56,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    marginTop: Platform.OS === "ios" ? 44 : 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 40,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  boldSubtitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    height: 52,
  },
  otpInputWrapper: {
    width: "100%",
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
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: theme.spacing.xs,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpBoxFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  otpBoxError: {
    borderColor: theme.colors.danger,
  },
  otpBoxText: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  timerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  resendText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textDecorationLine: "underline",
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.sm,
    fontWeight: theme.fontWeights.medium,
  },
});

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
} from "react-native";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { PhoneSchema, OtpSchema, PhoneBody, OtpBody } from "@repo/schema";
import { Routes } from "../../constants/routes";
import { theme } from "../../constants";
import { Feather } from "@expo/vector-icons";
import Button from "../../components/ui/button";
import FormPhone from "../../components/ui/form-phone";
import IconButton from "../../components/ui/icon-button";
import { Images } from "../../../assets/images";
import { useRole } from "../../context/role-context";

export default function VerifyScreen() {
  const router = useRouter();
  const { setRole } = useRole();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timerCount, setTimerCount] = useState(30);

  const otpInputRef = useRef<TextInput>(null);

  const phoneMethods = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpMethods = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((lastTimerCount) => lastTimerCount - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerCount]);

  const onSendOtp = async (data: PhoneBody) => {
    console.log("Sending OTP to:", data.phone);
    setPhoneNumber(data.phone);
    setTimerCount(30);
    setStep("otp");
    // Focus the OTP inputs after rendering
    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 100);
  };

  const onVerifyOtp = async (data: OtpBody) => {
    console.log("Verifying OTP:", data.otp, "for", phoneNumber);
    alert("Verification Successful!");
    setRole("resident");
    router.replace(Routes.Root);
  };

  const handleResend = () => {
    if (timerCount === 0) {
      setTimerCount(30);
      console.log("Resending OTP to:", phoneNumber);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Top back navigation header */}
      <View style={styles.navBar}>
        <IconButton
          onPress={() => {
            if (step === "otp") {
              setStep("phone");
            } else {
              router.back();
            }
          }}
          icon={<Feather name="chevron-left" size={24} color={theme.colors.text} />}
        />
        <IconButton
          onPress={() => console.log("More options pressed")}
          icon={<Feather name="more-horizontal" size={24} color={theme.colors.text} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {step === "phone" ? (
          <>
            <View style={styles.header}>
              <Image source={Images.iconFull} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Verify Number</Text>
              <Text style={styles.subtitle}>
                We will send you a one-time passcode to verify your phone number
              </Text>
            </View>

            <FormProvider {...phoneMethods}>
              <View style={styles.form}>
                <FormPhone
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter 10-digit number"
                  required
                />

                <Button
                  onPress={phoneMethods.handleSubmit(onSendOtp)}
                  style={styles.submitButton}
                  disabled={phoneMethods.formState.isSubmitting}
                  loading={phoneMethods.formState.isSubmitting}
                >
                  Send OTP Code
                </Button>
              </View>
            </FormProvider>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Image source={Images.iconFull} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Verify Your Number</Text>
              <Text style={styles.subtitle}>We've sent a 6-digit code to</Text>
              <Text style={styles.boldSubtitle}>+91 {phoneNumber}</Text>
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
                          onChangeText={(text) => {
                            onChange(text);
                            if (text.length === 6) {
                              // Let them click verify or auto-trigger
                            }
                          }}
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
                    <TouchableOpacity onPress={handleResend}>
                      <Text style={styles.resendText}>Resend code</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Button
                  onPress={otpMethods.handleSubmit(onVerifyOtp)}
                  style={styles.submitButton}
                  disabled={otpMethods.formState.isSubmitting}
                  loading={otpMethods.formState.isSubmitting}
                >
                  Verify & Continue
                </Button>
              </View>
            </FormProvider>
          </>
        )}
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
    justifyContent: "space-between",
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
    fontWeight: "800",
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
    fontWeight: "700",
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
    fontWeight: "700",
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
    fontWeight: "700",
    color: theme.colors.text,
    textDecorationLine: "underline",
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.sm,
    fontWeight: "500",
  },
});

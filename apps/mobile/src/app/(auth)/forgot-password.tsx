import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { forgotPasswordRequestSchema, ForgotPasswordRequestBody } from "@repo/schema";
import { useForgotPassword } from "@repo/operations";
import { Routes } from "@/constants/routes";
import { theme } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useAlert } from "@/context/alert-context";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import FormInput from "@/components/ui/form-input";
import { Images } from "@/assets/images";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { showAlert } = useAlert();

  const methods = useForm({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: ForgotPasswordRequestBody) => {
    forgotPassword(data, {
      onSuccess: () => {
        router.push({
          pathname: Routes.Auth.ResetPassword,
          params: { email: data.email },
        });
      },
      onError: (err) => {
        showAlert({ title: "Error", description: err.message, variant: "error" });
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.navBar}>
        <IconButton
          onPress={() => router.back()}
          icon={<Feather name="chevron-left" size={24} color={theme.colors.text} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={Images.iconFull} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address and we'll send you a code to reset your password.
          </Text>
        </View>

        <FormProvider {...methods}>
          <View style={styles.form}>
            <FormInput
              name="email"
              label="Email Address"
              placeholder="Enter your registered email"
              keyboardType="email-address"
              required
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
              disabled={isPending}
              loading={isPending}
            >
              Send Reset Code
            </Button>
          </View>
        </FormProvider>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Text style={styles.linkText} onPress={() => router.back()}>
            Log In
          </Text>
        </View>
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
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: theme.spacing.md,
    height: 52,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.xxl,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textDecorationLine: "underline",
  },
});

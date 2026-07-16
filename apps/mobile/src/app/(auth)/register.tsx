import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { RegisterSchema, RegisterBody } from "@repo/schema";
import { Routes } from "../../constants/routes";
import { theme } from "../../constants";
import Button from "../../components/ui/button";
import FormInput from "../../components/ui/form-input";
import FormPhone from "../../components/ui/form-phone";

export default function RegisterScreen() {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: RegisterBody) => {
    console.log("Registration data:", data);
    // On success, redirect to verify phone screen
    router.push(Routes.Auth.Verify);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Register Society</Text>
          <Text style={styles.subtitle}>Create a Society Head account to set up and manage your apartment community</Text>
        </View>

        <FormProvider {...methods}>
          <View style={styles.form}>
            <FormInput
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              required
            />

            <FormInput
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              keyboardType="email-address"
              required
            />
            <FormPhone
              name="phone"
              label="Phone Number"
              placeholder="Enter 10-digit number"
              required
            />
            <FormInput
              name="password"
              label="Password"
              placeholder="Min. 6 characters"
              secureTextEntry
              showToggle
              required
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              secureTextEntry
              showToggle
              required
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Sign Up
            </Button>
          </View>
        </FormProvider>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.linkText} onPress={() => router.push(Routes.Auth.Login)}>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.section * 0.25,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
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

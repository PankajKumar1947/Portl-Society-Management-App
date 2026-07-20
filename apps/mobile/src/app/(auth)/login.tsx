import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { LoginSchema, LoginBody } from "@repo/schema";
import { useLogin } from "@repo/operations";
import { useAuth } from "@/context/auth-context";
import type { ApiErrorResponse } from "@repo/api-client";
import { Routes } from "@/constants/routes";
import { theme } from "@/constants";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { Images } from "@/assets/images";

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending: isSubmitting } = useLogin();
  const { signIn } = useAuth();

  const methods = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: LoginBody) => {
    login(data, {
      onSuccess: async (res) => {
        await signIn(res.accessToken, res.refreshToken);
        router.replace(Routes.Root);
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        const isUnverified =
          apiError.status === 401 &&
          (apiError.data as { emailVerified?: boolean })?.emailVerified === false;

        if (isUnverified) {
          router.push({ pathname: Routes.Auth.Verify, params: { email: data.email } });
          return;
        }
        Alert.alert("Login Failed", apiError.message);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={Images.iconFull} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to manage your apartment community</Text>
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

            <FormInput
              name="password"
              label="Password"
              placeholder="Enter your password"
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
              Log In
            </Button>
          </View>
        </FormProvider>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Are you a Society Head? </Text>
          <Text style={styles.linkText} onPress={() => router.push(Routes.Auth.Register)}>
            Register Society
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
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.section * 1.5,
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
    fontSize: 32,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
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

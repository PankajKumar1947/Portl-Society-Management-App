import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { CreateSocietyBody } from "@repo/schema";
import { useCreateSociety } from "@repo/operations";
import { useAuth } from "@/context/auth-context";
import { Routes } from "@/constants/routes";
import { theme } from "@/constants";
import type { ApiErrorResponse } from "@repo/api-client";
import { SocietyForm } from "@/components/society/society-form";

export default function SetupSocietyScreen() {
  const router = useRouter();
  const { mutate: createSociety, isPending: isSubmitting } = useCreateSociety();
  const { markSocietyCreated } = useAuth();

  const handleCreateSociety = (data: CreateSocietyBody) => {
    createSociety(data, {
      onSuccess: (res) => {
        Alert.alert(
          "Setup Completed",
          `Your society "${res.society.societyName}" has been successfully set up!\n\nJoining Code: ${res.society.societyCode}`,
          [
            {
              text: "Continue",
              onPress: async () => {
                await markSocietyCreated();
                router.replace(Routes.App);
              },
            },
          ],
        );
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        Alert.alert("Setup Failed", apiError.message);
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
          <Text style={styles.title}>Set Up Society</Text>
          <Text style={styles.subtitle}>
            Enter the details of your society or apartment community to register it.
          </Text>
        </View>

        <SocietyForm
          onSubmit={handleCreateSociety}
          isSubmitting={isSubmitting}
          submitButtonText="Complete Setup"
        />
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
    paddingTop: theme.spacing.section,
    paddingBottom: theme.spacing.xxl,
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
    marginTop: theme.spacing.xl,
    height: 52,
  },
});

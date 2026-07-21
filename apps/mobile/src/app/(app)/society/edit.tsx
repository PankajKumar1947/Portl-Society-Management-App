import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import { SocietyForm } from "@/components/society/society-form";
import { UpdateSocietyBody } from "@repo/schema";
import { useGetMySociety, useUpdateSociety } from "@repo/operations";
import type { ApiErrorResponse } from "@repo/api-client";

export default function EditSocietyScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { data: society, isLoading: isFetching } = useGetMySociety();
  const { mutate: updateSociety, isPending: isUpdating } = useUpdateSociety(
    society?.societyId || ""
  );

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isFetching) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Society" onBack={() => router.replace(Routes.Society.Index)} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!society) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Society" onBack={() => router.replace(Routes.Society.Index)} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
          <Text style={styles.errorText}>Society details not found</Text>
          <Button variant="outline" onPress={() => router.replace(Routes.Society.Index)}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdateSociety = (values: UpdateSocietyBody) => {
    updateSociety(values, {
      onSuccess: () => {
        router.replace(Routes.Society.Index);
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        Alert.alert("Update Failed", apiError.message || "Failed to update society");
      },
    });
  };

  const initialValues: UpdateSocietyBody = {
    societyName: society.societyName,
    societyType: society.societyType,
    primaryContactName: society.primaryContactName,
    primaryContactNumber: society.primaryContactNumber,
    primaryContactEmail: society.primaryContactEmail,
    establishedYear: society.establishedYear,
    address: society.address,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Society" onBack={() => router.replace(Routes.Society.Index)} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SocietyForm
            initialValues={initialValues}
            onSubmit={handleUpdateSociety}
            isSubmitting={isUpdating}
            submitButtonText="Update Details"
            isEdit
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

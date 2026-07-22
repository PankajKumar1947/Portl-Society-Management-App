import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import FlatForm from "./_components/flat-form";
import { CreateFlatBody } from "@repo/schema";
import { useGetTowers, useCreateFlat } from "@repo/operations";
import type { ApiErrorResponse } from "@repo/api-client";

export default function CreateFlatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: towers, isLoading: isTowersLoading } = useGetTowers();
  const { mutate: createFlat, isPending: isCreating } = useCreateFlat();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: CreateFlatBody) => {
    createFlat(
      {
        ...values,
        towerId: values.towerId || (id as string),
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: (err) => {
          const apiError = err as unknown as ApiErrorResponse;
          Alert.alert("Failed to create flat", apiError.message || "Unknown error");
        },
      },
    );
  };

  const towerOptions = (towers || []).map((t) => ({
    label: t.towerName,
    value: t.towerId,
  }));

  const isLoading = isTowersLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Add New Flat" onBack={() => router.back()} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <FlatForm
              towerId={id}
              towerOptions={towerOptions}
              onSubmit={handleSubmit}
              submitButtonText="Create Flat"
              isSubmitting={isCreating}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

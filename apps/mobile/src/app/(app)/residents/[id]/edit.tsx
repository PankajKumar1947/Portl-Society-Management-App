import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, View, Text, ActivityIndicator } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import ResidentForm from "../_components/resident-form";
import { ResidentFormValues } from "@repo/schema";
import { useGetMySociety, useGetTowers, useGetResidentDetail, useUpdateResident } from "@repo/operations";

export default function EditResidentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: society, isLoading: isSocietyLoading } = useGetMySociety({ enabled: true });
  const societyId = society?.societyId || "";

  const { data: towersData, isLoading: isTowersLoading } = useGetTowers(
    societyId,
    { enabled: !!societyId }
  );

  const { data: resident, isLoading: isResidentLoading } = useGetResidentDetail(id || "", { enabled: !!id });
  const { mutate: updateResidentMutation, isPending: isUpdating } = useUpdateResident(id || "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: ResidentFormValues) => {
    updateResidentMutation(
      values,
      {
        onSuccess: () => {
          Alert.alert("Success", "Resident updated successfully!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (err: Error) => {
          Alert.alert("Error", err.message || "Failed to update resident");
        },
      }
    );
  };

  const isLoading = isSocietyLoading || isTowersLoading || isResidentLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Resident" onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!resident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Resident" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Resident not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const towersOptions = towersData?.map((t) => ({
    label: t.towerName,
    value: t.towerId,
  })) || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title={`Edit ${resident.firstName}'s Info`} onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ResidentForm
            initialValues={resident}
            onSubmit={handleSubmit}
            submitButtonText="Save Changes"
            isSubmitting={isUpdating}
            towers={towersOptions}
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
  content: {
    padding: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

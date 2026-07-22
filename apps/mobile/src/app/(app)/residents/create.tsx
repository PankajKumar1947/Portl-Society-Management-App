import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, View, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import ResidentForm from "./_components/resident-form";
import { ResidentFormValues } from "@repo/schema";
import { useGetMySociety, useGetTowers, useCreateResident } from "@repo/operations";

export default function CreateResidentScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const { data: society, isLoading: isSocietyLoading } = useGetMySociety({ enabled: true });
  const societyId = society?.societyId || "";

  const { data: towersData, isLoading: isTowersLoading } = useGetTowers(
    societyId,
    { enabled: !!societyId }
  );

  const { mutate: createResidentMutation, isPending: isCreating } = useCreateResident();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: ResidentFormValues) => {
    if (!societyId) {
      Alert.alert("Error", "Society context not loaded. Please try again.");
      return;
    }
    createResidentMutation(
      {
        ...values,
        societyId,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Resident registered successfully!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (err: Error) => {
          Alert.alert("Failed to register resident", err.message || "Unknown error occurred.");
        },
      }
    );
  };

  const isLoading = isSocietyLoading || isTowersLoading;

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
        <ScreenHeader title="Add New Resident" onBack={() => router.back()} />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <ResidentForm
              onSubmit={handleSubmit}
              submitButtonText="Create Resident"
              isSubmitting={isCreating}
              towers={towersOptions}
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

import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import TowerForm from "./_components/tower-form";
import { CreateTowerBody, AclResource } from "@repo/schema";
import { useGetMySociety, useCreateTower, useAccessControl } from "@repo/operations";
import LoadingScreen from "@/components/layout/loading-screen";

export default function CreateTowerScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { canCreate } = useAccessControl(AclResource.TOWERS);

  const { data: society, isLoading } = useGetMySociety({ enabled: true });
  const { mutate: createTower, isPending: isCreating } = useCreateTower();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isLoading) return <LoadingScreen title="Create Tower" />;

  const handleSubmit = (values: CreateTowerBody) => {
    if (!society?.societyId) {
      Alert.alert("Error", "Society context not loaded. Please try again.");
      return;
    }
    createTower(
      {
        ...values,
        societyId: society.societyId,
      },
      {
        onSuccess: () => {
          router.back();
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Add New Tower" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {canCreate ? (
            <TowerForm
              societyId={society?.societyId}
              onSubmit={handleSubmit}
              submitButtonText="Create Tower"
              isSubmitting={isCreating}
            />
          ) : null}
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
});

import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import FlatForm from "./_components/flat-form";
import { CreateFlatBody, AclResource } from "@repo/schema";
import LoadingScreen from "@/components/layout/loading-screen";
import { useGetTowers, useCreateFlat, useAccessControl } from "@repo/operations";

export default function CreateFlatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { canCreate } = useAccessControl(AclResource.FLATS);

  const { data: towers, isLoading: isTowersLoading } = useGetTowers();
  const { mutate: createFlat, isPending: isCreating } = useCreateFlat();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const isLoading = isTowersLoading;
  if (isLoading) return <LoadingScreen title="Create Flat" />;

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
      },
    );
  };

  const towerOptions = (towers || []).map((t) => ({
    label: t.towerName,
    value: t.towerId,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Add New Flat" onBack={() => router.back()} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {canCreate ? (
              <FlatForm
                towerId={id}
                towerOptions={towerOptions}
                onSubmit={handleSubmit}
                submitButtonText="Create Flat"
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

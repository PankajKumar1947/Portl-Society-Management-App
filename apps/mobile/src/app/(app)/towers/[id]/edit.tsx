import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import TowerForm from "../_components/tower-form";
import { UpdateTowerBody } from "@repo/schema";
import LoadingScreen from "@/components/layout/loading-screen";
import { useGetTowerDetails, useUpdateTower } from "@repo/operations";

export default function EditTowerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: tower, isLoading: isTowerLoading } = useGetTowerDetails(id || "", { enabled: !!id });
  const { mutate: updateTower, isPending: isUpdating } = useUpdateTower(id || "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isTowerLoading) return <LoadingScreen title="Edit Tower" />;

  const handleSubmit = (values: UpdateTowerBody) => {
    if (!id) return;
    updateTower(values, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  const initialValues = tower
    ? {
      societyId: tower.societyId,
      towerName: tower.towerName,
      location: tower.location,
      appNumber: tower.appNumber,
      totalFloors: tower.totalFloors,
    }
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Tower" onBack={() => router.back()} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <TowerForm<UpdateTowerBody>
              isEdit
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitButtonText="Update Tower"
              isSubmitting={isUpdating}
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
});

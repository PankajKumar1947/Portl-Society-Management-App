import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import TowerForm from "../_components/tower-form";
import { UpdateTowerBody } from "@repo/schema";

export default function EditTowerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const mockTowerData = {
    towerName: "Tower A (Sunflower)",
    location: "North Block, Gate 1",
    appNumber: "TWR-A101",
    totalFloors: 12,
    totalFlats: 24,
  };

  const handleSubmit = (values: UpdateTowerBody) => {
    router.back();
  };

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
            initialValues={mockTowerData}
            onSubmit={handleSubmit}
            submitButtonText="Update Tower"
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

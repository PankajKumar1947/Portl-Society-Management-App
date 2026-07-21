import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import FlatForm from "./_components/flat-form";
import { CreateFlatBody } from "@repo/schema";

const TOWER_OPTIONS = [
  { label: "Tower A (Sunflower)", value: "tow_1" },
  { label: "Tower B (Daffodil)", value: "tow_2" },
  { label: "Tower C (Orchid)", value: "tow_3" },
];

export default function CreateFlatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: CreateFlatBody) => {
    router.back();
  };

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
          <FlatForm
            towerId={id}
            towerOptions={TOWER_OPTIONS}
            onSubmit={handleSubmit}
            submitButtonText="Create Flat"
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

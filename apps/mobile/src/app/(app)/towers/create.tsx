import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import TowerForm from "./_components/tower-form";
import { CreateTowerBody } from "@repo/schema";

export default function CreateTowerScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: CreateTowerBody) => {
    router.back();
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
          <TowerForm
            onSubmit={handleSubmit}
            submitButtonText="Create Tower"
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

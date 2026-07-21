import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import FlatForm from "../_components/flat-form";
import { UpdateFlatBody } from "@repo/schema";

export default function EditFlatScreen() {
  const { id, flatId } = useLocalSearchParams<{ id: string; flatId: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const mockFlatData = {
    flatNumber: "101",
    floorNumber: 1,
    numberOfRooms: 3,
    numberOfBathrooms: 2,
    kitchen: 1,
    balcony: 2,
    hallRoom: 1,
    status: "OCCUPIED" as const,
  };

  const handleSubmit = (values: UpdateFlatBody) => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Flat Details" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FlatForm<UpdateFlatBody>
            isEdit
            initialValues={mockFlatData}
            onSubmit={handleSubmit}
            submitButtonText="Update Flat"
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

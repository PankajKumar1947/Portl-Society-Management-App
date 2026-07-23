import React, { useLayoutEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import AmenityForm from "./_components/amenity-form";
import { useCreateAmenity } from "@repo/operations";
import { CreateAmenityBody } from "@repo/schema";

export default function CreateAmenityScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const { mutate: createAmenity, isPending } = useCreateAmenity();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: CreateAmenityBody) => {
    createAmenity(values, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Create Amenity" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AmenityForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitButtonText="Create"
            onCancel={() => router.back()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
});

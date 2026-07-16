import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";

const VEHICLE_TYPE_OPTIONS = [
  { label: "Car (Sedan)", value: "Car (Sedan)" },
  { label: "Car (SUV)", value: "Car (SUV)" },
  { label: "Car (Hatchback)", value: "Car (Hatchback)" },
  { label: "Two Wheeler", value: "Two Wheeler" },
  { label: "Other", value: "Other" },
];

export default function AddVehicleScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm({
    defaultValues: {
      type: "",
      number: "",
      model: "",
    },
  });

  const onSubmit = () => {
    router.replace(Routes.Profile.Vehicles);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Add Vehicle" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormSelect
              name="type"
              label="Select vehicle type"
              options={VEHICLE_TYPE_OPTIONS}
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="number"
              label="Enter vehicle plate number"
              placeholder="e.g. MH 12 AB 1234"
              autoCapitalize="characters"
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="model"
              label="Enter vehicle brand/model"
              placeholder="e.g. Honda City"
              required
            />
          </FormProvider>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            Save Vehicle
          </Button>
        </View>
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
    paddingBottom: 100,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

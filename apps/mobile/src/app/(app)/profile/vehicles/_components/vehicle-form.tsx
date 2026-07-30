import React from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { theme } from "@/constants";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import type { VehicleInput } from "@repo/schema";

interface VehicleFormProps {
  onSubmit: (data: VehicleInput) => Promise<void> | void;
  defaultValues?: VehicleInput;
  isPending?: boolean;
  submitText: string;
}

const VEHICLE_TYPE_OPTIONS = [
  { label: "Four Wheeler (Car/SUV)", value: "FOUR_WHEELER" },
  { label: "Two Wheeler (Bike/Scooter)", value: "TWO_WHEELER" },
];

const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  defaultValues = {
    vehicleType: "FOUR_WHEELER",
    vehicleNumber: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleColor: "",
    parkingSlot: "",
  },
  isPending = false,
  submitText,
}) => {
  const methods = useForm<VehicleInput>({
    defaultValues,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FormProvider {...methods}>
          <FormSelect
            name="vehicleType"
            label="Select vehicle type"
            options={VEHICLE_TYPE_OPTIONS}
            required
          />

          <View style={styles.fieldGap} />

          <FormInput
            name="vehicleNumber"
            label="Enter vehicle plate number"
            placeholder="e.g. MH12AB1234"
            autoCapitalize="characters"
            required
          />

          <View style={styles.fieldGap} />

          <FormInput
            name="vehicleBrand"
            label="Enter vehicle brand"
            placeholder="e.g. Honda"
          />

          <View style={styles.fieldGap} />

          <FormInput
            name="vehicleModel"
            label="Enter vehicle model"
            placeholder="e.g. City"
          />
        </FormProvider>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          variant="primary"
          style={styles.submitButton}
          onPress={methods.handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isPending}
        >
          {submitText}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VehicleForm;

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
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

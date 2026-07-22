import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/ui/form-select";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";
import { residentVehicleSchema, ResidentVehicleInput, VEHICLE_TYPE_OPTIONS } from "@repo/schema";
import { theme } from "@/constants";

interface StepVehicleProps {
  initialValues?: Partial<ResidentVehicleInput>;
  onSubmit: (values: ResidentVehicleInput) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function StepVehicle({
  initialValues,
  onSubmit,
  onBack,
  isSubmitting = false,
  submitButtonText = "Save Resident",
}: StepVehicleProps) {
  const methods = useForm<ResidentVehicleInput>({
    resolver: zodResolver(residentVehicleSchema) as any,
    defaultValues: {
      vehicleType: initialValues?.vehicleType || "NONE",
      vehicleNumber: initialValues?.vehicleNumber || "",
      vehicleBrand: initialValues?.vehicleBrand || "",
      vehicleModel: initialValues?.vehicleModel || "",
      vehicleColor: initialValues?.vehicleColor || "",
      parkingSlot: initialValues?.parkingSlot || "",
    },
  });

  const { handleSubmit, watch } = methods;
  const vehicleType = watch("vehicleType");

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.section}>
          <FormSelect
            name="vehicleType"
            label="Vehicle Details"
            options={VEHICLE_TYPE_OPTIONS}
          />

          {vehicleType !== "NONE" && (
            <>
              <FormInput
                name="vehicleNumber"
                label="Vehicle Number"
                placeholder="e.g. MH12AB1234"
                autoCapitalize="characters"
              />
              <FormInput
                name="vehicleBrand"
                label="Vehicle Brand"
                placeholder="e.g. Maruti Suzuki, Honda"
              />
              <FormInput
                name="vehicleModel"
                label="Vehicle Model"
                placeholder="e.g. Swift, City"
              />
              <FormInput
                name="vehicleColor"
                label="Vehicle Color"
                placeholder="e.g. White, Black"
              />
              <FormInput
                name="parkingSlot"
                label="Parking Slot Number"
                placeholder="e.g. P-402"
              />
            </>
          )}
        </View>

        <View style={styles.buttonRow}>
          {onBack && (
            <Button
              onPress={onBack}
              variant="outline"
              style={styles.flexButton}
            >
              Back
            </Button>
          )}
          <Button
            onPress={handleSubmit(onSubmit) as any}
            loading={isSubmitting}
            style={styles.flexButton}
          >
            {submitButtonText}
          </Button>
        </View>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    gap: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  flexButton: {
    flex: 1,
  },
});

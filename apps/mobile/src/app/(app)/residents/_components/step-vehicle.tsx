import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/ui/form-select";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";
import { residentVehicleSchema, ResidentVehicleInput, VEHICLE_TYPE_OPTIONS } from "@repo/schema";
import { theme } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "@/components/layout/empty-state";

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
      vehicles: initialValues?.vehicles || [],
    },
  });

  const { handleSubmit, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  const handleAddVehicle = () => {
    append({
      vehicleType: "FOUR_WHEELER",
      vehicleNumber: "",
      vehicleBrand: "",
      vehicleModel: "",
      vehicleColor: "",
      parkingSlot: "",
    });
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        {fields.length === 0 ? (
          <EmptyState
            icon="car-outline"
            title="No vehicles registered yet."
            action={
              <Button variant="outline" onPress={handleAddVehicle} style={styles.addButton}>
                Add Vehicle
              </Button>
            }
          />
        ) : (
          fields.map((field, index) => (
            <View key={field.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Vehicle #{index + 1}</Text>
                <TouchableOpacity onPress={() => remove(index)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>

              <FormSelect
                name={`vehicles.${index}.vehicleType`}
                label="Vehicle Type"
                options={VEHICLE_TYPE_OPTIONS.filter((o) => o.value !== "NONE")}
              />

              <FormInput
                name={`vehicles.${index}.vehicleNumber`}
                label="Vehicle Number"
                placeholder="e.g. MH12AB1234"
                autoCapitalize="characters"
                required
              />

              <FormInput
                name={`vehicles.${index}.vehicleBrand`}
                label="Vehicle Brand"
                placeholder="e.g. Maruti Suzuki, Honda"
              />

              <FormInput
                name={`vehicles.${index}.vehicleModel`}
                label="Vehicle Model"
                placeholder="e.g. Swift, City"
              />

              <FormInput
                name={`vehicles.${index}.vehicleColor`}
                label="Vehicle Color"
                placeholder="e.g. White, Black"
              />

              <FormInput
                name={`vehicles.${index}.parkingSlot`}
                label="Parking Slot Number"
                placeholder="e.g. P-402"
              />
            </View>
          ))
        )}

        {fields.length > 0 && (
          <Button
            variant="outline"
            onPress={handleAddVehicle}
            style={styles.addButton}
          >
            Add Another Vehicle
          </Button>
        )}

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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  addButton: {
    width: "100%",
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

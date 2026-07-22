import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/ui/form-select";
import FormInput from "@/components/ui/form-input";
import FormDate from "@/components/ui/form-date";
import ToggleSwitch from "@/components/ui/toggle-switch";
import Button from "@/components/ui/button";
import {
  residentAllotmentSchema,
  ResidentAllotmentInput,
  RESIDENT_TYPE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  OWNERSHIP_OPTIONS,
  DOC_TYPE_OPTIONS,
} from "@repo/schema";
import { theme } from "@/constants";

interface StepAllotmentProps {
  initialValues?: Partial<ResidentAllotmentInput>;
  towers?: { label: string; value: string }[];
  onSubmit: (values: ResidentAllotmentInput) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export default function StepAllotment({
  initialValues,
  towers = [],
  onSubmit,
  onBack,
  isSubmitting = false,
  submitButtonText = "Next",
}: StepAllotmentProps) {
  const methods = useForm<ResidentAllotmentInput>({
    resolver: zodResolver(residentAllotmentSchema) as any,
    defaultValues: {
      userId: initialValues?.userId || "",
      residentType: initialValues?.residentType || "OWNER",
      relationship: initialValues?.relationship || "",
      towerId: initialValues?.towerId || "",
      flatNumber: initialValues?.flatNumber || "",
      moveInDate: initialValues?.moveInDate || new Date().toISOString().split("T")[0],
      ownershipStatus: initialValues?.ownershipStatus || "OWNER",
      isPrimary: initialValues?.isPrimary ?? true,
      docType: initialValues?.docType || "NONE",
      documentNumber: initialValues?.documentNumber || "",
    },
  });

  const { handleSubmit, watch, control } = methods;
  const residentType = watch("residentType");
  const docType = watch("docType");

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.section}>
          <FormSelect
            name="residentType"
            label="Resident Type"
            options={RESIDENT_TYPE_OPTIONS}
            required
          />

          {residentType === "FAMILY_MEMBER" && (
            <FormSelect
              name="relationship"
              label="Relationship to Primary Resident"
              options={RELATIONSHIP_OPTIONS}
              required
            />
          )}

          <FormSelect
            name="towerId"
            label="Tower"
            options={towers}
            required
          />

          <FormInput
            name="flatNumber"
            label="Flat / Apartment Number"
            placeholder="e.g. 402"
            required
          />

          <FormDate
            name="moveInDate"
            label="Move-In Date"
            required
          />

          <FormSelect
            name="ownershipStatus"
            label="Ownership Status"
            options={OWNERSHIP_OPTIONS}
            required
          />

          <View style={styles.toggleRow}>
            <Controller
              control={control}
              name="isPrimary"
              render={({ field: { value, onChange } }) => (
                <ToggleSwitch
                  label="Is Primary Resident"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          <FormSelect
            name="docType"
            label="Document Verification"
            options={DOC_TYPE_OPTIONS}
          />

          {docType !== "NONE" && (
            <FormInput
              name="documentNumber"
              label="Document Number"
              placeholder="Enter document number"
            />
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
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

import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  residentFormSchema,
  ResidentFormValues,
  RESIDENT_TYPE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  OWNERSHIP_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  DOC_TYPE_OPTIONS,
} from "@repo/schema";
import { theme } from "@/constants";
import FormInput from "@/components/ui/form-input";
import FormPhone from "@/components/ui/form-phone";
import FormSelect from "@/components/ui/form-select";
import FormDate from "@/components/ui/form-date";
import ToggleSwitch from "@/components/ui/toggle-switch";
import Button from "@/components/ui/button";

interface ResidentFormProps {
  initialValues?: Partial<ResidentFormValues>;
  onSubmit: (values: ResidentFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  towers?: { label: string; value: string }[];
}

export default function ResidentForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Resident",
  towers = [],
}: ResidentFormProps) {
  const methods = useForm<ResidentFormValues>({
    resolver: zodResolver(residentFormSchema) as unknown as Resolver<ResidentFormValues>,
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      mobileNumber: initialValues?.mobileNumber || "",
      email: initialValues?.email || "",
      residentType: initialValues?.residentType || "OWNER",
      relationship: initialValues?.relationship || "",
      towerId: initialValues?.towerId || "",
      flatNumber: initialValues?.flatNumber || "",
      moveInDate: initialValues?.moveInDate || new Date().toISOString().split("T")[0],
      ownershipStatus: initialValues?.ownershipStatus || "OWNER",
      isPrimary: initialValues?.isPrimary ?? true,
      vehicleType: initialValues?.vehicleType || "NONE",
      vehicleNumber: initialValues?.vehicleNumber || "",
      vehicleBrand: initialValues?.vehicleBrand || "",
      vehicleModel: initialValues?.vehicleModel || "",
      vehicleColor: initialValues?.vehicleColor || "",
      parkingSlot: initialValues?.parkingSlot || "",
      docType: initialValues?.docType || "NONE",
      documentNumber: initialValues?.documentNumber || "",
    },
  });

  const { handleSubmit, watch, setValue, control } = methods;
  const residentType = watch("residentType");
  const vehicleType = watch("vehicleType");
  const docType = watch("docType");

  const handleFormSubmit = (data: ResidentFormValues) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.formContainer}>
        {/* Personal Details */}
        <View style={styles.section}>
          <FormInput
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
          />
          <FormInput
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
          />
          <FormPhone
            name="mobileNumber"
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            required
          />
          <FormInput
            name="email"
            label="Email Address"
            placeholder="e.g. resident@example.com"
            keyboardType="email-address"
          />
        </View>

        {/* Residency Details */}
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
        </View>

        {/* Vehicles Details */}
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

        {/* Documents */}
        <View style={styles.section}>
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

        <Button
          onPress={handleSubmit(handleFormSubmit)}
          loading={isSubmitting}
          style={styles.submitButton}
        >
          {submitButtonText}
        </Button>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
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
  submitButton: {
    marginTop: theme.spacing.md,
  },
});

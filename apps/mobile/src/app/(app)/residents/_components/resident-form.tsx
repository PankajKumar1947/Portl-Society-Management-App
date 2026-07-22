import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useForm, FormProvider, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { theme } from "@/constants";
import FormInput from "@/components/ui/form-input";
import FormPhone from "@/components/ui/form-phone";
import FormSelect from "@/components/ui/form-select";
import FormDate from "@/components/ui/form-date";
import ToggleSwitch from "@/components/ui/toggle-switch";
import Button from "@/components/ui/button";

// Define the validation schema
export const residentFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  residentType: z.enum(["OWNER", "TENANT", "FAMILY_MEMBER"]),
  relationship: z.enum(["SPOUSE", "SON", "DAUGHTER", "FATHER", "MOTHER", "BROTHER", "SISTER", "OTHER"]).optional().or(z.literal("")),
  towerId: z.string().min(1, "Tower selection is required"),
  flatNumber: z.string().min(1, "Flat number is required"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  ownershipStatus: z.enum(["OWNER", "TENANT", "CO-OWNER"]),
  isPrimary: z.boolean().default(false),
  
  // Vehicles
  vehicleType: z.enum(["TWO_WHEELER", "FOUR_WHEELER", "NONE"]).default("NONE"),
  vehicleNumber: z.string().optional().or(z.literal("")),
  vehicleBrand: z.string().optional().or(z.literal("")),
  vehicleModel: z.string().optional().or(z.literal("")),
  vehicleColor: z.string().optional().or(z.literal("")),
  parkingSlot: z.string().optional().or(z.literal("")),

  // Documents
  docType: z.enum(["AADHAR", "PAN", "PASSPORT", "VOTER_ID", "NONE"]).default("NONE"),
  documentNumber: z.string().optional().or(z.literal("")),
});

export type ResidentFormValues = z.infer<typeof residentFormSchema>;

interface ResidentFormProps {
  initialValues?: Partial<ResidentFormValues>;
  onSubmit: (values: ResidentFormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  towers?: { label: string; value: string }[];
}

const RESIDENT_TYPE_OPTIONS = [
  { label: "Owner", value: "OWNER" },
  { label: "Tenant", value: "TENANT" },
  { label: "Family Member", value: "FAMILY_MEMBER" },
];

const RELATIONSHIP_OPTIONS = [
  { label: "Spouse", value: "SPOUSE" },
  { label: "Son", value: "SON" },
  { label: "Daughter", value: "DAUGHTER" },
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Brother", value: "BROTHER" },
  { label: "Sister", value: "SISTER" },
  { label: "Other", value: "OTHER" },
];

const OWNERSHIP_OPTIONS = [
  { label: "Owner", value: "OWNER" },
  { label: "Tenant", value: "TENANT" },
  { label: "Co-Owner", value: "CO-OWNER" },
];

const VEHICLE_TYPE_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "2 Wheeler", value: "TWO_WHEELER" },
  { label: "4 Wheeler", value: "FOUR_WHEELER" },
];

const DOC_TYPE_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "Aadhar Card", value: "AADHAR" },
  { label: "PAN Card", value: "PAN" },
  { label: "Passport", value: "PASSPORT" },
  { label: "Voter ID", value: "VOTER_ID" },
];

export default function ResidentForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Resident",
  towers = [
    { label: "Tower A", value: "tower-a" },
    { label: "Tower B", value: "tower-b" },
    { label: "Tower C", value: "tower-c" },
  ],
}: ResidentFormProps) {
  const methods = useForm<ResidentFormValues>({
    resolver: zodResolver(residentFormSchema) as any,
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

  const handleFormSubmit = (data: any) => {
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

import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider, SubmitHandler, DefaultValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSocietySchema,
  updateSocietySchema,
  CreateSocietyBody,
  UpdateSocietyBody,
  SOCIETY_TYPE_OPTIONS,
  SOCIETY_STATUS_OPTIONS,
  ESTABLISHED_YEAR_OPTIONS,
} from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import FormPhone from "@/components/ui/form-phone";
import FormSelect from "@/components/ui/form-select";
import Button from "@/components/ui/button";

export type SocietyFormValues = CreateSocietyBody;

interface SocietyFormProps<T extends CreateSocietyBody | UpdateSocietyBody> {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  isEdit?: boolean;
}

export function SocietyForm<T extends CreateSocietyBody | UpdateSocietyBody = CreateSocietyBody>({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Society",
  isEdit = false,
}: SocietyFormProps<T>) {
  const schema = isEdit ? updateSocietySchema : createSocietySchema;

  const methods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: {
      societyName: initialValues?.societyName || "",
      societyType: initialValues?.societyType || "APARTMENT",
      primaryContactName: initialValues?.primaryContactName || "",
      primaryContactNumber: initialValues?.primaryContactNumber || "",
      primaryContactEmail: initialValues?.primaryContactEmail || "",
      establishedYear: initialValues?.establishedYear || new Date().getFullYear(),
      addressLine: initialValues?.addressLine || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      country: initialValues?.country || "India",
      pincode: initialValues?.pincode || "",
      geoLocation: initialValues?.geoLocation || "",
      supportMail: initialValues?.supportMail || "",
      supportCall: initialValues?.supportCall || "",
      website: initialValues?.website || "",
      logo: initialValues?.logo || "",
      coverImage: initialValues?.coverImage || "",
      status: initialValues?.status || "open",
    } as DefaultValues<T>,
  });

  const { handleSubmit } = methods;

  const handleFormSubmit: SubmitHandler<T> = (data) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.form}>
        <FormInput
          name="societyName"
          label="Society Name"
          placeholder="e.g. Green Meadows Apartment"
          required
        />

        <FormSelect
          name="societyType"
          label="Society Type"
          options={SOCIETY_TYPE_OPTIONS}
          required
        />

        <FormInput
          name="primaryContactName"
          label="Primary Contact Name"
          placeholder="e.g. John Doe (Society President)"
          required
        />

        <FormPhone
          name="primaryContactNumber"
          label="Primary Contact Number"
          placeholder="Enter 10-digit number"
          required
        />

        <FormInput
          name="primaryContactEmail"
          label="Primary Contact Email"
          placeholder="e.g. society@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <FormSelect
          name="establishedYear"
          label="Established Year"
          options={ESTABLISHED_YEAR_OPTIONS}
          placeholder="Select established year"
        />

        <FormInput
          name="addressLine"
          label="Address Line"
          placeholder="Street address, building, suite"
          required
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormInput
              name="city"
              label="City"
              placeholder="e.g. Bangalore"
              required
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormInput
              name="state"
              label="State"
              placeholder="e.g. Karnataka"
              required
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormInput
              name="country"
              label="Country"
              placeholder="e.g. India"
              required
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormInput
              name="pincode"
              label="Pincode"
              placeholder="e.g. 560001"
              required
            />
          </View>
        </View>

        <FormInput
          name="geoLocation"
          label="Geo-Location Coordinates"
          placeholder="e.g. 12.9716, 77.5946"
        />

        <FormInput
          name="supportMail"
          label="Support Email Address"
          placeholder="e.g. support@meadows.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormInput
          name="supportCall"
          label="Support Phone Number"
          placeholder="e.g. +91 98765 43210"
        />

        <FormInput
          name="website"
          label="Society Website"
          placeholder="e.g. https://greenmeadows.com"
          autoCapitalize="none"
        />

        <FormInput
          name="logo"
          label="Logo Image URL"
          placeholder="Logo image URL or local asset path"
        />

        <FormInput
          name="coverImage"
          label="Cover Image URL"
          placeholder="Cover background image URL"
        />

        {isEdit && (
          <FormSelect
            name="status"
            label="Society Operational Status"
            options={SOCIETY_STATUS_OPTIONS}
          />
        )}

        <Button
          onPress={handleSubmit(handleFormSubmit)}
          style={styles.submitButton}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: 16,
    height: 52,
  },
});

export default SocietyForm;

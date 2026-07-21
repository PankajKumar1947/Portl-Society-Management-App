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
      address: initialValues?.address || "",
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
          name="address"
          label="Address"
          placeholder="Full address of the society"
          multiline
          numberOfLines={3}
        />

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

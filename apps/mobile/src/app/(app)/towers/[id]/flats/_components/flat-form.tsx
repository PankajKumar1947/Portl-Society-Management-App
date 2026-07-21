import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider, SubmitHandler, DefaultValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFlatSchema,
  updateFlatSchema,
  CreateFlatBody,
  UpdateFlatBody,
  FLAT_STATUS_OPTIONS,
} from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import Button from "@/components/ui/button";

interface FlatFormProps<T extends CreateFlatBody | UpdateFlatBody> {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  isEdit?: boolean;
  societyId?: string;
  towerId?: string;
  towerOptions?: { label: string; value: string }[];
}

export function FlatForm<T extends CreateFlatBody | UpdateFlatBody = CreateFlatBody>({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Flat",
  isEdit = false,
  societyId,
  towerId,
  towerOptions,
}: FlatFormProps<T>) {
  const schema = isEdit ? updateFlatSchema : createFlatSchema;

  const values = initialValues as Partial<CreateFlatBody> | undefined;

  const methods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: {
      societyId: societyId || values?.societyId || "",
      towerId: towerId || values?.towerId || "",
      flatNumber: values?.flatNumber || "",
      floorNumber: values?.floorNumber,
      numberOfRooms: values?.numberOfRooms ?? 2,
      numberOfBathrooms: values?.numberOfBathrooms ?? 2,
      kitchen: values?.kitchen ?? 1,
      balcony: values?.balcony ?? 1,
      hallRoom: values?.hallRoom ?? 1,
      status: values?.status ?? "VACANT",
    } as DefaultValues<T>,
  });

  const { handleSubmit } = methods;

  const handleFormSubmit: SubmitHandler<T> = (data) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.form}>
        {towerOptions && towerOptions.length > 0 && !isEdit && (
          <>
            <FormSelect
              name="towerId"
              label="Select Tower / Apartment"
              options={towerOptions}
              required
            />
            <View style={styles.fieldGap} />
          </>
        )}

        <FormInput
          name="flatNumber"
          label="Flat Number"
          placeholder="e.g. 101, 202-A"
          required
        />

        <View style={styles.fieldGap} />

        <FormSelect
          name="status"
          label="Occupancy Status"
          options={FLAT_STATUS_OPTIONS}
          required
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="floorNumber"
          label="Floor Number"
          placeholder="e.g. 1"
          keyboardType="number-pad"
          type="number"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="numberOfRooms"
          label="Number of Rooms (BHK)"
          placeholder="e.g. 3"
          keyboardType="number-pad"
          type="number"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="numberOfBathrooms"
          label="Number of Bathrooms"
          placeholder="e.g. 2"
          keyboardType="number-pad"
          type="number"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="kitchen"
          label="Kitchen Count"
          placeholder="e.g. 1"
          keyboardType="number-pad"
          type="number"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="balcony"
          label="Balcony Count"
          placeholder="e.g. 2"
          keyboardType="number-pad"
          type="number"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="hallRoom"
          label="Hall / Living Room Count"
          placeholder="e.g. 1"
          keyboardType="number-pad"
          type="number"
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
  fieldGap: {
    height: 12,
  },
  submitButton: {
    marginTop: 24,
    height: 52,
  },
});

export default FlatForm;

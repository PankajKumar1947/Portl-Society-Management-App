import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, FormProvider, SubmitHandler, DefaultValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTowerSchema,
  updateTowerSchema,
  CreateTowerBody,
  UpdateTowerBody,
} from "@repo/schema";
import FormInput from "@/components/ui/form-input";
import Button from "@/components/ui/button";

interface TowerFormProps<T extends CreateTowerBody | UpdateTowerBody> {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  isEdit?: boolean;
  societyId?: string;
}

export function TowerForm<T extends CreateTowerBody | UpdateTowerBody = CreateTowerBody>({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Save Tower",
  isEdit = false,
  societyId,
}: TowerFormProps<T>) {
  const schema = isEdit ? updateTowerSchema : createTowerSchema;

  const values = initialValues as Partial<CreateTowerBody> | undefined;

  const methods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: {
      societyId: societyId || values?.societyId || "",
      towerName: values?.towerName || "",
      location: values?.location || "",
      appNumber: values?.appNumber || "",
      totalFloors: values?.totalFloors || 0,
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
          name="towerName"
          label="Tower / Apartment Name"
          placeholder="e.g. Tower A (Sunflower)"
          required
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="location"
          label="Location / Block"
          placeholder="e.g. North Block, Gate 1"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="appNumber"
          label="App / Reg Number"
          placeholder="e.g. TWR-A101"
        />

        <View style={styles.fieldGap} />

        <FormInput
          name="totalFloors"
          label="Total Floors"
          placeholder="e.g. 12"
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

export default TowerForm;

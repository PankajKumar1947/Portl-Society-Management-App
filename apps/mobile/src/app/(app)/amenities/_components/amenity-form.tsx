import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { useForm, FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { theme } from "@/constants";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextArea } from "@/components/ui/form-textarea";
import { MediaUploader } from "@/components/common/media-uploader";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { CreateAmenityBody, AMENITY_CATEGORIES, AMENITY_TYPES, MediaPurposes, EntityTypes, MediaData } from "@repo/schema";
import { TimeRangeInput } from "@/components/ui/time-range-input"

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AmenityFormProps {
  initialValues?: Partial<CreateAmenityBody>;
  onSubmit: (values: CreateAmenityBody) => void;
  isSubmitting: boolean;
  initialMedia?: MediaData[];
  initialGallery?: MediaData[];
  submitButtonText?: string;
  onCancel?: () => void;
}

export default function AmenityForm({
  initialValues,
  onSubmit,
  isSubmitting,
  initialMedia = [],
  initialGallery = [],
  submitButtonText = "Save",
  onCancel,
}: AmenityFormProps) {
  const [bookingRequired, setBookingRequired] = useState(initialValues?.bookingRequired ?? false);

  const defaultOpenHours = useMemo(() => {
    if (initialValues?.openHours && initialValues.openHours.length > 0) {
      return initialValues.openHours;
    }
    return Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      openTime: "08:00",
      closeTime: "22:00",
      isClosed: false,
    }));
  }, [initialValues]);

  const methods = useForm<CreateAmenityBody>({
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      category: initialValues?.category || "CLUBHOUSE",
      type: initialValues?.type || "INDOOR",
      towerIds: initialValues?.towerIds || [],
      floorNumber: initialValues?.floorNumber || "",
      location: initialValues?.location || "",
      thumbnail: initialValues?.thumbnail || "",
      gallery: initialValues?.gallery || [],
      capacity: initialValues?.capacity || 50,
      bookingRequired: initialValues?.bookingRequired ?? false,
      bookingDuration: initialValues?.bookingDuration || 60,
      bookingFee: initialValues?.bookingFee || 0,
      openHours: defaultOpenHours,
      status: initialValues?.status || "ACTIVE",
      rules: initialValues?.rules || "",
    },
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: "openHours",
  });

  const openHoursValues = useWatch({ control: methods.control, name: "openHours" });

  const handleFormSubmit = (values: CreateAmenityBody) => {
    onSubmit({
      ...values,
      bookingRequired,
      capacity: Number(values.capacity),
      bookingFee: Number(values.bookingFee),
      bookingDuration: values.bookingDuration ? Number(values.bookingDuration) : undefined,
    });
  };

  return (
    <FormProvider {...methods}>
      <FormInput
        name="name"
        label="Amenity Name"
        placeholder="Enter amenity name (e.g. Swimming Pool)"
        required
      />

      <View style={styles.fieldGap} />

      <FormSelect
        name="category"
        label="Category"
        options={AMENITY_CATEGORIES.map((c) => ({ label: c.replace("_", " "), value: c }))}
        placeholder="Select category"
        required
      />

      <View style={styles.fieldGap} />

      <FormSelect
        name="type"
        label="Type"
        options={AMENITY_TYPES.map((t) => ({ label: t, value: t }))}
        placeholder="Select type"
        required
      />

      <View style={styles.fieldGap} />

      <FormInput
        name="capacity"
        label="Max Capacity"
        placeholder="Max capacity allowed"
        keyboardType="numeric"
        required
      />

      <View style={styles.fieldGap} />

      <FormInput
        name="floorNumber"
        label="Floor Number"
        placeholder="e.g. Ground Floor, 1st Floor"
      />

      <View style={styles.fieldGap} />

      <FormInput
        name="location"
        label="Location Details"
        placeholder="e.g. Near Block A, Clubhouse building"
      />

      <View style={styles.fieldGap} />

      <ToggleSwitch
        label="Booking Required"
        description="Must be booked in advance by residents"
        value={bookingRequired}
        onChange={setBookingRequired}
      />

      {bookingRequired && (
        <>
          <View style={styles.fieldGap} />
          <FormInput
            name="bookingDuration"
            label="Default Booking Duration (minutes)"
            placeholder="e.g. 60"
            keyboardType="numeric"
            required
          />
          <View style={styles.fieldGap} />
          <FormInput
            name="bookingFee"
            label="Booking Fee"
            placeholder="0 for free"
            keyboardType="numeric"
            required
          />
        </>
      )}

      <View style={styles.fieldGap} />

      <FormTextArea
        name="description"
        label="Description"
        placeholder="Describe the amenity details"
        required
        maxLength={300}
      />

      <View style={styles.fieldGap} />

      <FormTextArea
        name="rules"
        label="Rules & Guidelines"
        placeholder="Rules for residents using this amenity"
        maxLength={500}
      />

      <View style={styles.fieldGap} />

      <Text style={styles.sectionLabel}>Thumbnail Image</Text>
      <MediaUploader
        purpose={MediaPurposes.AMENITY_GALLERY}
        entityType={EntityTypes.AMENITIES}
        maxFiles={1}
        initialMedia={initialMedia}
        acceptImagesOnly
        onChange={(ids) => methods.setValue("thumbnail", ids[0] || "")}
      />

      <View style={styles.fieldGap} />

      <Text style={styles.sectionLabel}>Gallery Images</Text>
      <MediaUploader
        purpose={MediaPurposes.AMENITY_GALLERY}
        entityType={EntityTypes.AMENITIES}
        maxFiles={5}
        initialMedia={initialGallery}
        acceptImagesOnly
        onChange={(ids) => methods.setValue("gallery", ids)}
      />

      <View style={styles.fieldGap} />

      <Text style={styles.sectionLabel}>Weekly Operating Timings</Text>
      {fields.map((field, idx) => {
        const isClosed = openHoursValues?.[idx]?.isClosed ?? false;
        return (
          <View key={field.id} style={styles.timingBlock}>
            <View style={styles.timingHeader}>
              <Text style={styles.dayText}>{DAYS_OF_WEEK[idx]}</Text>
              <View style={styles.closedToggle}>
                <Text style={styles.closedLabel}>Closed</Text>
                <Switch
                  value={isClosed}
                  onValueChange={(val) => methods.setValue(`openHours.${idx}.isClosed`, val)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.surface}
                  ios_backgroundColor={theme.colors.border}
                />
              </View>
            </View>
            {!isClosed && (
              <TimeRangeInput
                openTimeName={`openHours.${idx}.openTime`}
                closeTimeName={`openHours.${idx}.closeTime`}
              />
            )}
          </View>
        );
      })}

      <View style={styles.buttonRow}>
        {onCancel && (
          <Button
            variant="outline"
            style={styles.actionButton}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          style={styles.actionButton}
          onPress={methods.handleSubmit(handleFormSubmit)}
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
  fieldGap: {
    height: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  timingBlock: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  timingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  closedToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  closedLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
    height: 52,
  },
});

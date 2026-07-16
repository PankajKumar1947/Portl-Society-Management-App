import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextArea } from "@/components/ui/form-textarea";
import { ImageGallery, GalleryImage } from "@/components/ui/image-gallery";

const CATEGORY_OPTIONS = [
  { label: "Indoor", value: "indoor" },
  { label: "Outdoor", value: "outdoor" },
];

export default function CreateAmenityScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm({
    defaultValues: {
      name: "",
      category: "",
      capacity: "",
      timings: "",
      rules: "",
    },
  });

  const onSubmit = () => {
    router.push(Routes.Amenities.Index);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Create Amenity"
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormInput
              name="name"
              label="Amenity Name"
              placeholder="Enter amenity name"
              required
            />

            <FormSelect
              name="category"
              label="Category"
              placeholder="Select category"
              options={CATEGORY_OPTIONS}
            />

            <FormInput
              name="capacity"
              label="Capacity"
              placeholder="e.g. 50 People"
            />

            <FormInput
              name="timings"
              label="Timings"
              placeholder="e.g. 06:00 AM – 10:00 PM"
            />

            <FormTextArea
              name="rules"
              label="Rules"
              placeholder="Enter rules (one per line)"
              maxLength={500}
            />

            <Text style={styles.sectionLabel}>Gallery Images</Text>
            <ImageGallery
              images={galleryImages}
              onAdd={(image) => setGalleryImages((prev) => [...prev, image])}
              onRemove={(index) => setGalleryImages((prev) => prev.filter((_, i) => i !== index))}
            />
          </FormProvider>

          <Button
            onPress={methods.handleSubmit(onSubmit)}
            style={styles.submit}
          >
            Create Amenity
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  submit: {
    height: 52,
    marginTop: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
});

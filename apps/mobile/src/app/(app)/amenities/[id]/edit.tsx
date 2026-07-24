import React, { useLayoutEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import AmenityForm from "../_components/amenity-form";
import { useGetAmenityDetail, useUpdateAmenity, useAccessControl } from "@repo/operations";
import { CreateAmenityBody, AclResource } from "@repo/schema";

export default function EditAmenityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: amenity, isLoading } = useGetAmenityDetail(id ?? "", { enabled: !!id });
  const { mutate: updateAmenity, isPending } = useUpdateAmenity(id ?? "");

  const { canUpdate } = useAccessControl(AclResource.AMENITIES);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleSubmit = (values: CreateAmenityBody) => {
    updateAmenity(values, {
      onSuccess: () => router.back(),
    });
  };

  if (isLoading) {
    return <LoadingScreen title="Edit Amenity" onBack={() => router.back()} />;
  }

  if (!amenity) {
    return <NotFoundScreen title="Edit Amenity" message="Amenity not found" onBack={() => router.back()} />;
  }

  if (!canUpdate) {
    router.back();
    return null;
  }

  const initialValues: Partial<CreateAmenityBody> = {
    name: amenity.name,
    description: amenity.description,
    category: amenity.category,
    type: amenity.type,
    towerIds: amenity.towerIds,
    floorNumber: amenity.floorNumber,
    location: amenity.location,
    thumbnail: amenity.thumbnail,
    gallery: amenity.gallery,
    capacity: amenity.capacity,
    bookingRequired: amenity.bookingRequired,
    bookingDuration: amenity.bookingDuration,
    bookingFee: amenity.bookingFee,
    openHours: amenity.openHours,
    status: amenity.status,
    rules: amenity.rules,
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Amenity" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AmenityForm
            initialValues={initialValues}
            initialMedia={amenity.thumbnailFile ? [amenity.thumbnailFile] : []}
            initialGallery={amenity.galleryFiles || []}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitButtonText="Save"
            onCancel={() => router.back()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
});

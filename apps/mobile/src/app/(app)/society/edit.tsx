import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { SocietyForm } from "@/components/society/society-form";
import { UpdateSocietyBody, AclResource } from "@repo/schema";
import { useGetMySociety, useUpdateSociety, useAccessControl } from "@repo/operations";
import type { ApiErrorResponse } from "@repo/api-client";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";

export default function EditSocietyScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { canUpdate } = useAccessControl(AclResource.SOCIETY);

  const { data: society, isLoading: isFetching } = useGetMySociety();
  const { mutate: updateSociety, isPending: isUpdating } = useUpdateSociety(
    society?.societyId || ""
  );

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isFetching) {
    return <LoadingScreen title="Edit Society" onBack={() => router.replace(Routes.Society.Index)} />;
  }

  if (!society) {
    return <NotFoundScreen title="Edit Society" message="Society details not found" onBack={() => router.replace(Routes.Society.Index)} />;
  }

  const handleUpdateSociety = (values: UpdateSocietyBody) => {
    updateSociety(values, {
      onSuccess: () => {
        router.replace(Routes.Society.Index);
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        Alert.alert("Update Failed", apiError.message || "Failed to update society");
      },
    });
  };

  const initialValues: UpdateSocietyBody = {
    societyName: society.societyName,
    societyType: society.societyType,
    primaryContactName: society.primaryContactName,
    primaryContactNumber: society.primaryContactNumber,
    primaryContactEmail: society.primaryContactEmail,
    establishedYear: society.establishedYear,
    addressLine: society.addressLine,
    city: society.city,
    state: society.state,
    country: society.country,
    pincode: society.pincode,
    geoLocation: society.geoLocation,
    supportMail: society.supportMail,
    supportCall: society.supportCall,
    website: society.website,
    logo: society.logo,
    coverImage: society.coverImage,
    status: society.status,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Society" onBack={() => router.replace(Routes.Society.Index)} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {canUpdate ? (
            <SocietyForm
              initialValues={initialValues}
              onSubmit={handleUpdateSociety}
              isSubmitting={isUpdating}
              submitButtonText="Update Details"
              isEdit
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
});

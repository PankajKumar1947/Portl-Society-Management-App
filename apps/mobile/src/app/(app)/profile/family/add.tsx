import React, { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { useAddFamilyMember } from "@repo/operations";
import type { AddFamilyMemberInput } from "@repo/schema";
import FamilyMemberForm from "./_components/family-form";

export default function AddFamilyMemberScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string; name?: string; relationship?: string }>();
  const isEdit = !!params.id;
  const { mutate: addMember, isPending } = useAddFamilyMember();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const defaultValues: AddFamilyMemberInput = {
    firstName: params.name ? params.name.split(" ")[0] : "",
    lastName: params.name ? params.name.split(" ").slice(1).join(" ") : "",
    relationship: (params.relationship as AddFamilyMemberInput["relationship"]) || "OTHER",
    phoneNumber: params.id ? "9876543210" : "",
    dateOfBirth: params.id ? "1988-06-15" : "",
  };

  const onSubmit = async (form: AddFamilyMemberInput) => {
    if (isEdit) {
      router.replace(Routes.Profile.MyFamily);
      return;
    }

    addMember({
      firstName: form.firstName,
      lastName: form.lastName,
      relationship: form.relationship,
      phoneNumber: form.phoneNumber?.replace(/\s/g, "") || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
    }, {
      onSuccess: () => {
        router.replace(Routes.Profile.MyFamily);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={isEdit ? "Family Details" : "Add Family Member"} onBack={() => router.back()} />
      <FamilyMemberForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        isPending={isPending}
        submitText={isEdit ? "Save Changes" : "Save Member"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});


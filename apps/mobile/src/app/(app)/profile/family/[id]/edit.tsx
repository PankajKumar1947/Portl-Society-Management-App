import React, { useLayoutEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import IconButton from "@/components/ui/icon-button";
import { useGetFamilyMemberDetail, useUpdateFamilyMember, useDeleteFamilyMember } from "@repo/operations";
import { AddFamilyMemberInput } from "@repo/schema";
import { useAlert } from "@/context/alert-context";
import FamilyMemberForm from "../_components/family-form";

export default function EditFamilyMemberScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();

  const { data: member, isLoading } = useGetFamilyMemberDetail(id);
  const { mutate: updateMember, isPending: isUpdating } = useUpdateFamilyMember(id);
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteFamilyMember();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const handleDelete = () => {
    showAlert({
      title: "Remove Family Member",
      description: "Are you sure you want to remove this family member?",
      variant: "warning",
      confirmLabel: "Delete",
      showCancel: true,
      onConfirm: () => {
        deleteMember(id, {
          onSuccess() {
            router.replace(Routes.Profile.MyFamily);
          },
        });
      },
    });
  };

  const onSubmit = (form: AddFamilyMemberInput) => {
    updateMember({
      firstName: form.firstName,
      lastName: form.lastName,
      relationship: form.relationship,
      phoneNumber: form.phoneNumber?.replace(/\s/g, "") || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
    }, {
      onSuccess() {
        router.replace(Routes.Profile.MyFamily);
      }
    });
  };

  if (isLoading || !member) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Family Member" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const defaultValues: AddFamilyMemberInput = {
    firstName: member.firstName,
    lastName: member.lastName,
    relationship: member.relationship as AddFamilyMemberInput["relationship"],
    phoneNumber: member.phoneNumber || "",
    dateOfBirth: member.dateOfBirth || "",
  };

  const rightElement = (
    <IconButton
      icon={<Ionicons name="trash-outline" size={22} color={theme.colors.danger} />}
      onPress={handleDelete}
      variant="ghost"
      size="md"
      disabled={isDeleting}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Edit Family Member"
        onBack={() => router.back()}
        rightElement={rightElement}
      />
      <FamilyMemberForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        isPending={isUpdating}
        submitText="Save Changes"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

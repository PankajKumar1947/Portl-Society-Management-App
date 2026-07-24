import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import FormDate from "@/components/ui/form-date";
import { useAddFamilyMember } from "@repo/operations";
import { RELATIONSHIP_OPTIONS } from "@repo/schema";
import type { AddFamilyMemberInput } from "@repo/schema";

interface AddFormValues {
  name: string;
  relationship: string;
  dob: string;
  phone: string;
}

export default function AddFamilyMemberScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string; name?: string; relationship?: string }>();
  const isEdit = !!params.id;
  const { mutateAsync: addMember, isPending } = useAddFamilyMember();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm<AddFormValues>({
    defaultValues: {
      name: params.name || "",
      relationship: params.relationship || "",
      dob: params.id ? "1988-06-15" : "",
      phone: params.id ? "98765 43210" : "",
    },
  });

  const onSubmit = async (form: AddFormValues) => {
    if (isEdit) {
      router.replace(Routes.Profile.MyFamily);
      return;
    }
    try {
      const [firstName, ...lastParts] = form.name.trim().split(" ");
      const lastName = lastParts.join(" ") || firstName;
      await addMember({
        firstName,
        lastName,
        relationship: form.relationship as AddFamilyMemberInput["relationship"],
        phoneNumber: form.phone.replace(/\s/g, "") || undefined,
        dateOfBirth: form.dob || undefined,
      });
      router.replace(Routes.Profile.MyFamily);
    } catch {
      Alert.alert("Error", "Failed to add family member. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title={isEdit ? "Family Details" : "Add Family Member"} onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormInput
              name="name"
              label="Enter full name"
              placeholder="Full Name"
              required
            />

            <View style={styles.fieldGap} />

            <FormSelect
              name="relationship"
              label="Select relationship"
              options={RELATIONSHIP_OPTIONS}
              required
            />

            <View style={styles.fieldGap} />

            <FormDate
              name="dob"
              label="Select DOB"
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="phone"
              label="Enter mobile number"
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              required
            />
          </FormProvider>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
          >
            {isEdit ? "Save Changes" : "Save Member"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

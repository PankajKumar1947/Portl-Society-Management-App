import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import FormDate from "@/components/ui/form-date";

const RELATIONSHIP_OPTIONS = [
  { label: "Spouse", value: "Spouse" },
  { label: "Son", value: "Son" },
  { label: "Daughter", value: "Daughter" },
  { label: "Father", value: "Father" },
  { label: "Mother", value: "Mother" },
  { label: "Brother", value: "Brother" },
  { label: "Sister", value: "Sister" },
  { label: "Other", value: "Other" },
];

export default function AddFamilyMemberScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string; name?: string; relationship?: string }>();
  const isEdit = !!params.id;

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm({
    defaultValues: {
      name: params.name || "",
      relationship: params.relationship || "",
      dob: params.id ? "1988-06-15" : "",
      phone: params.id ? "98765 43210" : "",
    },
  });

  const onSubmit = () => {
    // Navigate back to my family listing screen
    router.replace(Routes.Profile.MyFamily);
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

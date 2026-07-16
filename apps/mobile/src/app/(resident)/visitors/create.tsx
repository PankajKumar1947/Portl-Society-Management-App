import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { TypeSelector } from "@/components/ui/type-selector";
import { Card } from "@/components/ui/card";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormPhone } from "@/components/ui/form-phone";
import { FormSelect } from "@/components/ui/form-select";
import { FormDate } from "@/components/ui/form-date";


const VISITOR_TYPES = [
  { id: "guest", label: "Guest" },
  { id: "delivery", label: "Delivery" },
  { id: "service_staff", label: "Service Staff" },
  { id: "cab", label: "Cab" },
];

const PURPOSE_OPTIONS = [
  { label: "Personal Visit", value: "personal" },
  { label: "Delivery", value: "delivery" },
  { label: "Maintenance Work", value: "maintenance" },
  { label: "Other", value: "other" },
];

const FLAT_OPTIONS = [
  { label: "A-1202", value: "a1202" },
  { label: "A-1203", value: "a1203" },
  { label: "B-102", value: "b102" },
  { label: "C-903", value: "c903" },
];

export default function CreateVisitorScreen() {
  const router = useRouter();
  const [visitorType, setVisitorType] = useState("guest");
  const [preApprove, setPreApprove] = useState(false);

  const methods = useForm({
    defaultValues: {
      visitorName: "",
      mobileNumber: "",
      purposeOfVisit: "",
      visitDate: undefined as Date | undefined,
      visitTime: undefined as Date | undefined,
      flatNumber: "",
    },
  });

  const onSubmit = () => {
    router.push(Routes.Visitors.Pass("new-pass"));
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Create Visitor Pass" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Visitor Type */}
          <Card variant="flat" style={styles.section}>
            <TypeSelector
              options={VISITOR_TYPES}
              value={visitorType}
              onChange={setVisitorType}
            />
          </Card>

          {/* Form Fields */}
          <FormProvider {...methods}>
            <View style={styles.form}>
              <FormInput
                name="visitorName"
                label="Visitor Name"
                placeholder="Enter name"
                required
              />
              <FormPhone
                name="mobileNumber"
                label="Mobile Number"
                placeholder="Enter mobile number"
                required
              />
              <FormSelect
                name="purposeOfVisit"
                label="Purpose of Visit"
                placeholder="Select purpose"
                options={PURPOSE_OPTIONS}
              />
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <FormDate
                    name="visitDate"
                    label="Visit Date"
                    placeholder="15 May 2024"
                    mode="date"
                  />
                </View>
                <View style={styles.halfField}>
                  <FormDate
                    name="visitTime"
                    label="Visit Time"
                    placeholder="10:00 AM"
                    mode="time"
                  />
                </View>
              </View>
              <FormSelect
                name="flatNumber"
                label="Flat Number"
                placeholder="A-1202"
                options={FLAT_OPTIONS}
              />

              {/* Pre-Approve toggle */}
              <Card variant="flat" style={styles.toggleCard}>
                <ToggleSwitch
                  label="Pre-Approve"
                  description="Allow auto-entry after approval"
                  value={preApprove}
                  onChange={setPreApprove}
                />
              </Card>
            </View>
          </FormProvider>
          <Button onPress={methods.handleSubmit(onSubmit)} style={styles.submit}>
            Create Pass
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 112,
    gap: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
  },
  form: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  halfField: {
    flex: 1,
  },
  toggleCard: {
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.xs,
  },
  submit: {
    height: 52,
    marginTop: theme.spacing.md,
  },
});

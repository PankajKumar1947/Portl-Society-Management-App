import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormPhone } from "@/components/ui/form-phone";
import { FormSelect } from "@/components/ui/form-select";
import { FormDate } from "@/components/ui/form-date";
import { useCreateVisitor, useGetTowers, useGetFlats, useAccessControl, useAccessControlContext } from "@repo/operations";
import { AclResource, VISITOR_TYPE, VISITOR_TYPE_OPTIONS, PURPOSE_OPTIONS, CreateVisitorForm, UserRoles } from "@repo/schema";

export default function CreateVisitorScreen() {
  const router = useRouter();
  const [preApprove, setPreApprove] = useState(false);
  const { canViewModule, isResident } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);

  const { mutate: createVisitor, isPending } = useCreateVisitor();
  const { data: towers = [] } = useGetTowers({ enabled: canViewTower });

  const methods = useForm<CreateVisitorForm>({
    defaultValues: {
      type: VISITOR_TYPE.GUEST,
      name: "",
      mobile: "",
      purpose: "",
      validFrom: undefined,
      validTo: undefined,
      towerId: "",
      flatId: "",
    },
  });

  const selectedTowerId = methods.watch("towerId");
  const { data: flats = [] } = useGetFlats(selectedTowerId || "", { enabled: !!selectedTowerId && canViewFlat });

  useEffect(() => {
    if (selectedTowerId) {
      methods.setValue("flatId", "");
    }
  }, [selectedTowerId]);

  const onSubmit = (data: CreateVisitorForm) => {
    createVisitor({
      name: data.name,
      mobile: data.mobile,
      type: data.type,
      purpose: data.purpose,
      flatId: canViewFlat ? data.flatId : undefined,
      validFrom: data.validFrom ? new Date(data.validFrom).toISOString() : undefined,
      validTo: data.validTo ? new Date(data.validTo).toISOString() : undefined,
      preApprove: isResident ? preApprove : false,
    }, {
      onSuccess: (res) => {
        router.push({
          ...Routes.Visitors.Pass(res.data.logId),
          params: {
            id: res.data.logId,
            name: res.data.name,
            type: res.data.type,
            date: "Today",
            time: "Pending Arrival",
            status: res.data.status,
            passId: res.data.passCode || "N/A",
          },
        });
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Create Visitor Pass" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields */}
          <FormProvider {...methods}>
            <View style={styles.form}>
              <FormSelect
                name="type"
                label="Visitor Type"
                placeholder="Select type"
                options={VISITOR_TYPE_OPTIONS}
              />
              <FormInput
                name="name"
                label="Visitor Name"
                placeholder="Enter name"
                required
              />
              <FormPhone
                name="mobile"
                label="Mobile Number"
                placeholder="Enter mobile number"
                required
              />
              <FormSelect
                name="purpose"
                label="Purpose of Visit"
                placeholder="Select purpose"
                options={PURPOSE_OPTIONS}
              />
              {isResident && (
                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <FormDate
                      name="validFrom"
                      label="Valid From"
                      placeholder="Start Date"
                      mode="date"
                    />
                  </View>
                  <View style={styles.halfField}>
                    <FormDate
                      name="validTo"
                      label="Valid To"
                      placeholder="End Date"
                      mode="date"
                    />
                  </View>
                </View>
              )}
              {canViewTower && (
                <FormSelect
                  name="towerId"
                  label="Tower"
                  placeholder="Select Tower"
                  options={towers.map((t) => ({ label: t.towerName, value: t.towerId }))}
                />
              )}
              {canViewFlat && selectedTowerId && (
                <FormSelect
                  name="flatId"
                  label="Flat Number"
                  placeholder="Select Flat"
                  options={flats.map((f) => ({ label: f.flatNumber, value: f.flatId }))}
                />
              )}

              {/* Pre-Approve toggle */}
              {isResident && (
                <Card variant="flat" style={styles.toggleCard}>
                  <ToggleSwitch
                    label="Pre-Approve"
                    description="Allow auto-entry after approval"
                    value={preApprove}
                    onChange={setPreApprove}
                  />
                </Card>
              )}
            </View>
          </FormProvider>
          <Button onPress={methods.handleSubmit(onSubmit)} style={styles.submit} loading={isPending}>
            Create Pass
          </Button>
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
  content: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingBottom: 180,
  },
  label: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.xs,
  },
  form: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
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

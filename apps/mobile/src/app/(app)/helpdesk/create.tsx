import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import { useCreateHelpdeskTicket, useAccessControl } from "@repo/operations";
import { AclResource } from "@repo/schema";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormTextArea from "@/components/ui/form-textarea";
import FormSelect from "@/components/ui/form-select";
import { CreateHelpdeskTicketBody, CATEGORY_OPTIONS } from "@repo/schema";

export default function RaiseTicketScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { mutate: createTicket, isPending } = useCreateHelpdeskTicket();
  const { canCreate } = useAccessControl(AclResource.HELPDESK_TICKETS);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm<CreateHelpdeskTicketBody>({
    defaultValues: {
      category: "" as CreateHelpdeskTicketBody["category"],
      subject: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateHelpdeskTicketBody) => {
    createTicket(data, {
      onSuccess: () => {
        router.replace(Routes.Helpdesk.Index);
      },
    });
  };

  if (!canCreate) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Raise New Ticket" onBack={() => router.back()} />
        <View style={styles.centered}>
          <Text style={styles.noAccessText}>You do not have permission to raise tickets.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Raise New Ticket"
          onBack={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormSelect
              name="category"
              label="Category"
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="subject"
              label="Subject"
              placeholder="Brief description"
              required
            />

            <View style={styles.fieldGap} />

            <FormTextArea
              name="description"
              label="Description"
              placeholder="Describe your issue"
              required
              maxLength={500}
            />
          </FormProvider>

          <View style={styles.bottomGap} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Ticket"}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  noAccessText: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  bottomGap: {
    height: 40,
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

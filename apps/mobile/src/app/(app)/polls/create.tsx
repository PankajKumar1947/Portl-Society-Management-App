import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormTextArea from "@/components/ui/form-textarea";
import FormSelect from "@/components/ui/form-select";
import FormDate from "@/components/ui/form-date";
import Card from "@/components/ui/card";
import IconButton from "@/components/ui/icon-button";

export default function CreatePollScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [optionKeys, setOptionKeys] = useState<number[]>([0, 1]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const CHOICE_OPTIONS = [
    { label: "Single Select (One answer)", value: "single" },
    { label: "Multi Select (Multiple answers)", value: "multi" },
  ];

  const getTodayStr = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getFutureStr = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const methods = useForm({
    defaultValues: {
      question: "",
      description: "",
      choiceType: "single",
      startDate: getTodayStr(),
      endDate: getFutureStr(3),
    },
  });

  const handleAddOption = () => {
    setOptionKeys((prev) => [...prev, Math.max(...prev, 0) + 1]);
  };

  const handleRemoveOption = (keyToRemove: number) => {
    if (optionKeys.length <= 2) return;
    setOptionKeys((prev) => prev.filter((k) => k !== keyToRemove));
  };

  const onSubmit = () => {
    // Navigate back to the index screen
    router.replace(Routes.Polls.Index);
  };

  const startDateVal = methods.watch("startDate");
  const endDateVal = methods.watch("endDate");

  const getCalculatedDuration = () => {
    if (!startDateVal || !endDateVal) return null;
    const start = new Date(startDateVal);
    const end = new Date(endDateVal);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid date format";
    }
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "End date must be after start date";
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Create Poll"
          onBack={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <FormInput
              name="question"
              label="Question"
              placeholder="Ask a question"
              required
            />

            <View style={styles.fieldGap} />

            <FormTextArea
              name="description"
              label="Description"
              placeholder="Describe the poll details (optional)"
              maxLength={300}
            />

            <View style={styles.fieldGap} />

            <FormSelect
              name="choiceType"
              label="Choice Type"
              options={CHOICE_OPTIONS}
              required
            />

            <View style={styles.fieldGap} />

            <View style={styles.dateRow}>
              <View style={styles.dateCol}>
                <FormDate
                  name="startDate"
                  label="Start Date"
                  required
                />
              </View>
              <View style={styles.dateCol}>
                <FormDate
                  name="endDate"
                  label="End Date"
                  required
                />
              </View>
            </View>

            {getCalculatedDuration() && (
              <Card variant="flat" style={styles.durationCard}>
                <Ionicons name="time-outline" size={18} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                <Text style={styles.durationText}>
                  {getCalculatedDuration()?.includes("must") || getCalculatedDuration()?.includes("Invalid")
                    ? getCalculatedDuration()
                    : `Calculated duration: ${getCalculatedDuration()}`}
                </Text>
              </Card>
            )}

            <View style={styles.fieldGap} />

            <View style={styles.optionsHeaderRow}>
              <Text style={styles.optionsLabel}>Poll Options</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handleAddOption}>
                <Text style={styles.addOptionText}>+ Add Option</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>
              {optionKeys.map((key, index) => (
                <View key={key} style={styles.optionInputRow}>
                  <View style={styles.optionInputWrapper}>
                    <FormInput
                      name={`option_${key}`}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                  </View>
                  {optionKeys.length > 2 && (
                    <IconButton
                      onPress={() => handleRemoveOption(key)}
                      icon={<Ionicons name="trash-outline" size={20} color={theme.colors.danger} />}
                      variant="ghost"
                      style={styles.deleteButton}
                    />
                  )}
                </View>
              ))}
            </View>
          </FormProvider>

          <View style={styles.bottomGap} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
          >
            Create Poll
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
    paddingBottom: 120,
  },
  fieldGap: {
    height: theme.spacing.md,
  },
  optionsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  addOptionText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primaryDark,
  },
  optionsList: {
    gap: theme.spacing.sm,
  },
  optionInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  optionInputWrapper: {
    flex: 1,
  },
  deleteButton: {
    marginTop: 18, // Align with input height styling offset
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
  dateRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
  },
  dateCol: {
    flex: 1,
  },
  durationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
    marginTop: theme.spacing.xs,
  },
  durationText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
});

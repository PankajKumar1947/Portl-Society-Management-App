import React, { useLayoutEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
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
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import FormMultiSelect from "@/components/ui/form-multi-select";
import { useCreatePoll, useGetTowers, useAccessControl } from "@repo/operations";
import { RECIPIENT_OPTIONS, AclResource } from "@repo/schema";

export default function CreatePollScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { canCreate } = useAccessControl(AclResource.POLLS);
  const { mutateAsync: createPoll, isPending } = useCreatePoll();
  const { data: towers } = useGetTowers();
  const [optionKeys, setOptionKeys] = useState<number[]>([0, 1]);
  const [allTowers, setAllTowers] = useState(true);
  const [selectedTowers, setSelectedTowers] = useState<string[]>([]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const towerOptions = useMemo(() => {
    if (!towers) return [];
    return towers.map((t) => ({ label: t.towerName, value: t.towerId }));
  }, [towers]);

  const getTodayStr = () => new Date().toISOString().split("T")[0];
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
      recipient: [] as string[],
      endDate: getFutureStr(3),
    },
  });

  const endDate = methods.watch("endDate");

  const getCalculatedDuration = () => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return "Invalid date format";
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "Ends today";
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  const handleAddOption = () => {
    setOptionKeys((prev) => [...prev, Math.max(...prev, 0) + 1]);
  };

  const handleRemoveOption = (keyToRemove: number) => {
    if (optionKeys.length <= 2) return;
    setOptionKeys((prev) => prev.filter((k) => k !== keyToRemove));
  };

  const getOptionLabel = (key: number): string => {
    const values = methods.getValues() as Record<string, unknown>;
    return (values[`option_${key}`] as string) || "";
  };

  const buildPayload = (status: "draft" | "published") => {
    const values = methods.getValues() as Record<string, unknown>;
    const options = optionKeys.map((key) => ({
      label: getOptionLabel(key),
      displayOrder: 0,
    }));
    return {
      question: values.question as string,
      description: (values.description as string) || undefined,
      choiceType: values.choiceType as "single" | "multi",
      recipient: values.recipient as ("residents" | "guard")[],
      expiresAt: new Date(values.endDate as string).toISOString(),
      options,
      status,
      towerIds: allTowers ? undefined : (selectedTowers.length > 0 ? selectedTowers : undefined),
    };
  };

  const onSubmit = async () => {
    const valid = await methods.trigger();
    if (!valid) return;
    await createPoll(buildPayload("draft"));
    router.replace(Routes.Polls.Index);
  };

  const handlePublish = async () => {
    const valid = await methods.trigger();
    if (!valid) return;
    await createPoll(buildPayload("published"));
    router.replace(Routes.Polls.Index);
  };

  if (!canCreate) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Create Poll" onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Create Poll" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
              options={[
                { label: "Single Select (One answer)", value: "single" },
                { label: "Multi Select (Multiple answers)", value: "multi" },
              ]}
              required
            />

            <View style={styles.fieldGap} />

            <View style={styles.towerSection}>
              <ToggleSwitch
                label="All Towers"
                value={allTowers}
                onChange={setAllTowers}
              />
              {!allTowers && towerOptions.length > 0 && (
                <View style={styles.towerList}>
                  {towerOptions.map((tower) => {
                    const selected = selectedTowers.includes(tower.value);
                    return (
                      <TouchableOpacity
                        key={tower.value}
                        onPress={() =>
                          setSelectedTowers((prev) =>
                            prev.includes(tower.value)
                              ? prev.filter((id) => id !== tower.value)
                              : [...prev, tower.value]
                          )
                        }
                        style={styles.towerRow}
                      >
                        <Text style={styles.towerLabel}>{tower.label}</Text>
                        <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                          {selected && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.fieldGap} />

            <FormMultiSelect
              name="recipient"
              label="Recipients"
              options={[...RECIPIENT_OPTIONS]}
              required
            />

            <View style={styles.fieldGap} />

            <View style={styles.dateRow}>
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
                  Duration: {getCalculatedDuration()}
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
          {isPending ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <View style={styles.buttonRow}>
              <Button
                variant="outline"
                style={styles.bottomButton}
                textStyle={styles.bottomButtonText}
                onPress={onSubmit}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                style={styles.bottomButton}
                onPress={handlePublish}
              >
                Publish
              </Button>
            </View>
          )}
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
  towerSection: {
    marginBottom: theme.spacing.sm,
  },
  towerList: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  towerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  towerLabel: {
    fontSize: 15,
    color: theme.colors.text,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
    marginTop: 18,
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
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  bottomButton: {
    flex: 1,
    height: 48,
  },
  bottomButtonText: {
    fontSize: 14,
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

import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PollResults from "./_components/poll-results";
import { MOCK_POLLS, Poll } from "./index";

export default function PollDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const [poll, setPoll] = useState<Poll | undefined>(() =>
    MOCK_POLLS.find((p) => p.id === id)
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (!poll) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Poll Details" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Poll not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleOption = (optId: string) => {
    const isMulti = poll.choiceType === "multi";
    if (isMulti) {
      setSelectedOptions((prev) =>
        prev.includes(optId)
          ? prev.filter((id) => id !== optId)
          : [...prev, optId]
      );
    } else {
      setSelectedOptions([optId]);
    }
  };

  const handleVoteSubmit = () => {
    if (selectedOptions.length === 0) return;

    // Simulate voting by incrementing option votes
    const updatedOptions = poll.options.map((opt) => {
      if (selectedOptions.includes(opt.id)) {
        const newVotes = opt.votes + 1;
        return {
          ...opt,
          votes: newVotes,
        };
      }
      return opt;
    });

    const newTotalVotes = poll.totalVotes + selectedOptions.length;
    const finalOptions = updatedOptions.map((opt) => ({
      ...opt,
      percentage: Math.round((opt.votes / newTotalVotes) * 100),
    }));

    setPoll({
      ...poll,
      voted: true,
      totalVotes: newTotalVotes,
      options: finalOptions,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Poll Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>{poll.question}</Text>
        <Text style={styles.endsIn}>Ends in {poll.endsIn}</Text>
        <Text style={styles.description}>{poll.description}</Text>

        {!poll.voted ? (
          // Voting Mode
          <View style={styles.optionsContainer}>
            {poll.options.map((opt) => {
              const isSelected = selectedOptions.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  style={[
                    styles.voteOptionButton,
                    isSelected && styles.selectedVoteOption,
                  ]}
                  onPress={() => handleToggleOption(opt.id)}
                >
                  {poll.choiceType === "multi" ? (
                    <View style={[styles.checkboxOutline, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                  ) : (
                    <View style={styles.radioOutline}>
                      {isSelected && <View style={styles.radioFill} />}
                    </View>
                  )}
                  <Text style={styles.voteOptionLabel}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <PollResults
            options={poll.options}
            showTotalVotes
            totalVotes={poll.totalVotes}
          />
        )}
      </ScrollView>

      {/* Footer view */}
      <View style={styles.footerContainer}>
        {!poll.voted ? (
          <Button
            variant="primary"
            style={styles.submitVoteButton}
            disabled={selectedOptions.length === 0}
            onPress={handleVoteSubmit}
          >
            Submit Vote
          </Button>
        ) : (
          <Card variant="flat" style={styles.votedIndicatorCard}>
            <Ionicons name="checkbox-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.votedIndicatorText}>You have voted.</Text>
          </Card>
        )}
      </View>
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
  },
  question: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 28,
  },
  endsIn: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  voteOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
  },
  selectedVoteOption: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primaryDark,
  },
  checkboxOutline: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primaryDark,
  },
  voteOptionLabel: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  submitVoteButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  votedIndicatorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
  },
  votedIndicatorText: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.medium,
  },
});

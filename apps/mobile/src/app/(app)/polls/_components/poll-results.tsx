import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants";

export interface PollResultOption {
  optionId: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface PollResultsProps {
  options: PollResultOption[];
  showTotalVotes?: boolean;
  totalVotes?: number;
}

export const PollResults: React.FC<PollResultsProps> = ({
  options,
  showTotalVotes = false,
  totalVotes,
}) => {
  return (
    <View style={styles.resultsContainer}>
      {options.map((opt) => (
        <View key={opt.optionId} style={styles.optionResult}>
          <View style={styles.optionTextRow}>
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <Text style={styles.optionPercentage}>
              {opt.percentage}% ({opt.votes})
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(opt.percentage, 2)}%` },
              ]}
            />
          </View>
        </View>
      ))}

      {showTotalVotes && totalVotes !== undefined && (
        <Text style={styles.totalVotesText}>Total Votes: {totalVotes}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    gap: theme.spacing.md,
  },
  optionResult: {
    width: "100%",
  },
  optionTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  optionPercentage: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radius.full,
  },
  totalVotesText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});

export default PollResults;

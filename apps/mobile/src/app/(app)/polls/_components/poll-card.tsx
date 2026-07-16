import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import PollResults from "./poll-results";
import { Poll } from "../index";

export interface PollCardProps {
  poll: Poll;
  onVotePress?: () => void;
  onCardPress?: () => void;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  onVotePress,
  onCardPress,
}) => {
  const showVoteButton = !poll.voted && poll.status === "live" && onVotePress;

  return (
    <Card variant="flat" style={styles.card} onPress={onCardPress}>
      <Text style={styles.questionText}>{poll.question}</Text>
      <Text style={styles.endsInText}>
        {poll.status === "live" ? `Ends in ${poll.endsIn}` : poll.endsIn}
      </Text>

      <PollResults options={poll.options} />

      {showVoteButton && (
        <Button
          variant="primary"
          style={styles.cardVoteButton}
          onPress={onVotePress}
        >
          Vote Now
        </Button>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
  },
  questionText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  endsInText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  cardVoteButton: {
    marginTop: theme.spacing.md,
    height: 44,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

export default PollCard;

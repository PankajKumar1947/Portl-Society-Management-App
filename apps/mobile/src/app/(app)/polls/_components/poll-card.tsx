import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { PollData } from "@repo/schema";
import { formatRemainingTime, getPollStatusBadgeConfig, RECIPIENT_LABELS } from "@/utils/poll";
import { useAccessControl } from "@repo/operations";

export interface PollCardProps {
  poll: PollData;
  onVotePress?: () => void;
  onCardPress?: () => void;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  onVotePress,
  onCardPress,
}) => {
  const { isSuperUser } = useAccessControl();
  const badgeConfig = getPollStatusBadgeConfig(poll.status);
  const showVoteButton = poll.status === "published" && onVotePress;

  return (
    <Card variant="flat" style={styles.card} onPress={onCardPress}>
      <View style={styles.header}>
        <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
        {!isSuperUser && poll.status === "published" && (
          <Text style={styles.endsIn}>{formatRemainingTime(poll.expiresAt, poll.status)}</Text>
        )}
      </View>
      <Text style={styles.questionText}>{poll.question}</Text>
      {poll.description ? (
        <Text style={styles.description} numberOfLines={2}>{poll.description}</Text>
      ) : null}
      <View style={styles.metaRow}>
        {poll.recipient?.map((r) => {
          const config = RECIPIENT_LABELS[r];
          return config ? (
            <Badge key={r} variant={config.variant}>{config.label}</Badge>
          ) : null;
        })}
      </View>
      {isSuperUser && (
        <Text style={styles.endsIn}>{formatRemainingTime(poll.expiresAt, poll.status)}</Text>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  questionText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    flexWrap: "wrap",
  },
  endsIn: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  cardVoteButton: {
    marginTop: theme.spacing.md,
    height: 44,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

export default PollCard;

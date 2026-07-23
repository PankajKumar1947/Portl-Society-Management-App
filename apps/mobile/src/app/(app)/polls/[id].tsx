import React, { useLayoutEffect, useState, useEffect } from "react";
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
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import { formatDate, roleLabel } from "@/utils/notice";
import { formatRemainingTime, getPollStatusBadgeConfig } from "@/utils/poll";
import {
  useGetPollDetail,
  useGetPollResults,
  useCastVote,
  usePublishPoll,
  useClosePoll,
  useDeletePoll,
} from "@repo/operations";
import { UserRoles } from "@repo/schema";
import { useRole } from "@/context/role-context";
import PollResults from "./_components/poll-results";

export default function PollDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { role } = useRole();
  const isAdmin = role === UserRoles.ADMIN || role === UserRoles.SUPER_ADMIN;

  const { data: poll, isLoading: pollLoading } = useGetPollDetail(id ?? "", { enabled: !!id });
  const { data: resultsData, refetch: refetchResults } = useGetPollResults(id ?? "", { enabled: !!id });
  const { mutateAsync: castVote, isPending: votePending } = useCastVote(id ?? "");
  const { mutateAsync: publishPoll, isPending: publishPending } = usePublishPoll(id ?? "");
  const { mutateAsync: closePoll, isPending: closePending } = useClosePoll(id ?? "");
  const { mutateAsync: deletePoll, isPending: deletePending } = useDeletePoll(id ?? "");

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [localResults, setLocalResults] = useState(resultsData?.data);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [closeModalVisible, setCloseModalVisible] = useState(false);

  const isMulti = poll?.choiceType === "multi";

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  useEffect(() => {
    if (resultsData?.data) {
      setLocalResults(resultsData.data);
      setHasVoted(!!resultsData.data.userVotedOptionId);
    }
  }, [resultsData]);

  const handleToggleOption = (optId: string) => {
    if (hasVoted) return;
    if (isMulti) {
      setSelectedOptions((prev) =>
        prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
      );
    } else {
      setSelectedOptions([optId]);
    }
  };

  const handleVoteSubmit = async () => {
    if (selectedOptions.length === 0 || !id) return;
    await castVote({ optionId: selectedOptions[0] });
    setHasVoted(true);
    setSelectedOptions([]);
    refetchResults();
  };

  const handlePublish = async () => {
    if (!id) return;
    await publishPoll();
    refetchResults();
  };

  const handleClose = () => {
    setCloseModalVisible(true);
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const loading = pollLoading || publishPending || closePending || deletePending;
  const badgeConfig = poll ? getPollStatusBadgeConfig(poll.status) : { label: "", variant: "success" as const };
  const resultOptions = localResults?.options ?? [];
  const totalVotes = localResults?.totalVotes ?? 0;

  if (loading && !poll) {
    return <LoadingScreen title="Poll Details" onBack={() => router.back()} />;
  }

  if (!poll) {
    return <NotFoundScreen title="Poll Details" message="Poll not found" onBack={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Poll Details"
        onBack={() => router.back()}
        rightElement={
          isAdmin && poll.status !== "closed" ? (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
          <Text style={styles.date}>{formatRemainingTime(poll.expiresAt, poll.status)}</Text>
        </View>

        <Text style={styles.question}>{poll.question}</Text>
        {poll.description ? (
          <Text style={styles.description}>{poll.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          {poll.recipient?.map((r) => (
            <Badge key={r} variant={r === "residents" ? "success" : "warning"}>
              {r === "residents" ? "Residents" : "Guards"}
            </Badge>
          ))}
        </View>

        {poll.publisher && (
          <View style={styles.publisherRow}>
            <Ionicons name="person-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.publisherText}>
              Published by {poll.publisher.firstName} {poll.publisher.lastName} · {roleLabel(poll.publisher.role)}
            </Text>
          </View>
        )}

        {poll.publishedOn && (
          <Text style={styles.date}>Published {formatDate(poll.publishedOn)}</Text>
        )}

        {(hasVoted || poll.status === "closed") && resultOptions.length > 0 && (
          <View style={styles.sectionGap}>
            <Text style={styles.sectionTitle}>
              {poll.status === "closed" ? "Final Results" : "Results"}
            </Text>
            <PollResults
              options={resultOptions}
              showTotalVotes
              totalVotes={totalVotes}
            />
          </View>
        )}

        {!hasVoted && poll.status === "published" && (
          <View style={styles.sectionGap}>
            <Text style={styles.sectionTitle}>Cast Your Vote</Text>
            <View style={styles.optionsContainer}>
              {poll.options?.map((opt) => {
                const isSelected = selectedOptions.includes(opt.optionId);
                return (
                  <TouchableOpacity
                    key={opt.optionId}
                    activeOpacity={0.8}
                    style={[
                      styles.voteOptionButton,
                      isSelected && styles.selectedVoteOption,
                    ]}
                    onPress={() => handleToggleOption(opt.optionId)}
                  >
                    {isMulti ? (
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
          </View>
        )}

        {isAdmin && poll.status === "draft" && (
          <View style={styles.sectionGap}>
            <Button variant="primary" onPress={handlePublish} disabled={publishPending}>
              Publish Poll
            </Button>
          </View>
        )}

        {isAdmin && poll.status === "published" && (
          <View style={styles.sectionGap}>
            <Button variant="outline" onPress={handleClose} disabled={closePending}>
              Close Poll
            </Button>
          </View>
        )}
      </ScrollView>

      {!hasVoted && poll.status === "published" && (
        <View style={styles.footerContainer}>
          <Button
            variant="primary"
            style={styles.submitVoteButton}
            disabled={votePending || selectedOptions.length === 0}
            onPress={handleVoteSubmit}
          >
            {votePending ? "Submitting..." : "Submit Vote"}
          </Button>
        </View>
      )}

      {hasVoted && (
        <View style={styles.footerContainer}>
          <Card variant="flat" style={styles.votedIndicatorCard}>
            <Ionicons name="checkbox-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.votedIndicatorText}>You have voted.</Text>
          </Card>
        </View>
      )}

      <Modal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete Poll"
        description="Are you sure you want to delete this poll?"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={async () => {
          setDeleteModalVisible(false);
          if (!id) return;
          await deletePoll();
          router.replace(Routes.Polls.Index);
        }}
      />

      <Modal
        visible={closeModalVisible}
        onClose={() => setCloseModalVisible(false)}
        title="Close Poll"
        description="Are you sure you want to close this poll? Votes will be frozen."
        confirmLabel="Close"
        confirmVariant="danger"
        onConfirm={async () => {
          setCloseModalVisible(false);
          if (!id) return;
          await closePoll();
          refetchResults();
        }}
      />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionGap: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  question: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 28,
  },
  date: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    flexWrap: "wrap",
    marginBottom: theme.spacing.sm,
  },
  publisherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  publisherText: {
    fontSize: 13,
    color: theme.colors.textMuted,
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

});

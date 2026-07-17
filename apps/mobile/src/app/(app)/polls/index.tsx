import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Ionicons } from "@expo/vector-icons";
import PollCard from "./_components/poll-card";

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  status: "live" | "past" | "upcoming";
  endsIn: string;
  options: PollOption[];
  totalVotes: number;
  voted: boolean;
  choiceType?: "single" | "multi";
}

export const MOCK_POLLS: Poll[] = [
  {
    id: "PL101",
    question: "Should we organize a community event?",
    description: "We are planning a community event next month. Please vote to help us gauge interest.",
    status: "live",
    endsIn: "2d 10h",
    totalVotes: 166,
    voted: false,
    options: [
      { id: "1", label: "Yes", votes: 120, percentage: 72 },
      { id: "2", label: "No", votes: 46, percentage: 28 },
    ],
  },
  {
    id: "PL102",
    question: "Gym equipment replacement preference?",
    description: "Which gym equipment should we prioritize for replacement this quarter?",
    status: "live",
    endsIn: "5d 4h",
    totalVotes: 80,
    voted: false,
    choiceType: "multi",
    options: [
      { id: "1", label: "Treadmill", votes: 45, percentage: 56 },
      { id: "2", label: "Cross Trainer", votes: 25, percentage: 31 },
      { id: "3", label: "Dumbbell Set", votes: 10, percentage: 13 },
    ],
  },
  {
    id: "PL103",
    question: "Weekend Pool Timing Extension",
    description: "Do you support extending the swimming pool hours until 9 PM on weekends?",
    status: "past",
    endsIn: "Ended 2 weeks ago",
    totalVotes: 210,
    voted: true,
    options: [
      { id: "1", label: "Support", votes: 150, percentage: 71 },
      { id: "2", label: "Oppose", votes: 60, percentage: 29 },
    ],
  },
];

const FILTER_TABS = [
  { id: "live", label: "Live" },
  { id: "past", label: "Past" },
  { id: "upcoming", label: "Upcoming" },
];

export default function PollsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("live");

  const filteredPolls = MOCK_POLLS.filter((poll) => poll.status === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Polls"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Polls.Create)}
            icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
            variant="ghost"
          />
        }
      />

      <View style={styles.tabContainer}>
        {FILTER_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Button
              key={tab.id}
              variant={active ? "primary" : "ghost"}
              onPress={() => setActiveTab(tab.id)}
              style={{ ...styles.tabButton, ...(active ? styles.activeTabButton : {}) }}
              textStyle={{ ...styles.tabText, ...(active ? styles.activeTabText : {}) }}
            >
              {tab.label}
            </Button>
          );
        })}
      </View>

      <FlatList
        data={filteredPolls}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PollCard
            poll={item}
            onVotePress={() => router.push(Routes.Polls.Details(item.id))}
            onCardPress={() => router.push(Routes.Polls.Details(item.id))}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab} polls available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
    padding: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  tabButton: {
    flex: 1,
    height: 40,
    borderRadius: theme.radius.full,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  separator: {
    height: theme.spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});

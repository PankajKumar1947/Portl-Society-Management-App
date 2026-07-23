import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import IconButton from "@/components/ui/icon-button";
import { EmptyState } from "@/components/layout/empty-state";

export interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: "pending" | "in_progress" | "resolved";
}

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "CP101",
    title: "Neighbor playing loud music repeatedly",
    category: "Noisy Neighbor",
    description: "Flat B-302 plays extremely loud music past 11 PM on weekdays. This is violating society noise regulations.",
    date: "16 Jul 2026",
    status: "pending",
  },
  {
    id: "CP102",
    title: "Housekeeping not cleaning common areas",
    category: "Housekeeping",
    description: "Lobby elevator floors on Tower A have trash piled up since last two days. No cleanup staff has cleaned it despite repeated reminders.",
    date: "14 Jul 2026",
    status: "in_progress",
  },
  {
    id: "CP103",
    title: "Security staff misbehaving at main gate",
    category: "Security Behavior",
    description: "Night shift guard misbehaved with visitor guest delivery partners and did not cooperate with the app verification process.",
    date: "10 Jul 2026",
    status: "resolved",
  },
];

export default function ComplaintsScreen() {
  const router = useRouter();
  const [complaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<"active" | "resolved">("active");

  const filteredComplaints = complaints.filter((item) => {
    if (activeTab === "active") {
      return item.status === "pending" || item.status === "in_progress";
    }
    return item.status === "resolved";
  });

  const getStatusBadge = (status: Complaint["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "in_progress":
        return <Badge variant="info">In Progress</Badge>;
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Complaints"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Complaints.Create)}
            icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "resolved" && styles.activeTab]}
          onPress={() => setActiveTab("resolved")}
        >
          <Text style={[styles.tabText, activeTab === "resolved" && styles.activeTabText]}>Resolved</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.card}
            onPress={() => router.push(Routes.Complaints.Details(item.id))}
          >
            <View style={styles.cardHeader}>
              <View style={styles.categoryWrapper}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              {getStatusBadge(item.status)}
            </View>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState icon="alert-circle-outline" title="No complaints found." />
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
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primaryDark,
  },
  list: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  categoryWrapper: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.md,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  titleText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  descText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  separator: {
    height: theme.spacing.md,
  },
});

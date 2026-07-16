import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface ComplaintDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: "pending" | "in_progress" | "resolved";
  timeline: {
    title: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
}

const DETAILS_MOCK: Record<string, ComplaintDetail> = {
  CP101: {
    id: "CP101",
    title: "Neighbor playing loud music repeatedly",
    category: "Noisy Neighbor",
    description: "Flat B-302 plays extremely loud music past 11 PM on weekdays. This is violating society noise regulations.",
    date: "16 Jul 2026",
    status: "pending",
    timeline: [
      {
        title: "Complaint Registered",
        description: "Complaint successfully lodged by resident Sunita Sharma.",
        time: "16 Jul 2026, 11:30 AM",
        completed: true,
      },
      {
        title: "Awaiting Review",
        description: "Society administrator has received the grievance alert.",
        time: "Pending",
        completed: false,
      },
    ],
  },
  CP102: {
    id: "CP102",
    title: "Housekeeping not cleaning common areas",
    category: "Housekeeping",
    description: "Lobby elevator floors on Tower A have trash piled up since last two days. No cleanup staff has cleaned it despite repeated reminders.",
    date: "14 Jul 2026",
    status: "in_progress",
    timeline: [
      {
        title: "Complaint Registered",
        description: "Complaint successfully lodged by resident Sunita Sharma.",
        time: "14 Jul 2026, 09:30 AM",
        completed: true,
      },
      {
        title: "Assigned to Supervisor",
        description: "Assigned to housekeeping head to coordinate lobby cleanup.",
        time: "15 Jul 2026, 02:00 PM",
        completed: true,
      },
      {
        title: "Under Resolution",
        description: "Housekeeping crew dispatching to Tower A elevator lobby.",
        time: "In Progress",
        completed: false,
      },
    ],
  },
  CP103: {
    id: "CP103",
    title: "Security staff misbehaving at main gate",
    category: "Security Behavior",
    description: "Night shift guard misbehaved with visitor guest delivery partners and did not cooperate with the app verification process.",
    date: "10 Jul 2026",
    status: "resolved",
    timeline: [
      {
        title: "Complaint Registered",
        description: "Complaint successfully lodged by resident Sunita Sharma.",
        time: "10 Jul 2026, 08:30 AM",
        completed: true,
      },
      {
        title: "Assigned to Security Supervisor",
        description: "Security chief notified to query gate security logs.",
        time: "11 Jul 2026, 10:00 AM",
        completed: true,
      },
      {
        title: "Warning Issued",
        description: "Gate guard reprimanded and re-trained on society visitor processing.",
        time: "12 Jul 2026, 04:00 PM",
        completed: true,
      },
      {
        title: "Resolved",
        description: "Issue closed successfully.",
        time: "12 Jul 2026, 04:15 PM",
        completed: true,
      },
    ],
  },
};

export default function ComplaintDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = DETAILS_MOCK[id || "CP101"] || DETAILS_MOCK.CP101;

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const getStatusBadge = (status: ComplaintDetail["status"]) => {
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
      <ScreenHeader title="Complaint Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Card variant="flat" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryWrapper}>
              <Text style={styles.categoryText}>{detail.category}</Text>
            </View>
            {getStatusBadge(detail.status)}
          </View>
          <Text style={styles.title}>{detail.title}</Text>
          <Text style={styles.desc}>{detail.description}</Text>
          <Text style={styles.date}>Registered on {detail.date}</Text>
        </Card>

        {/* Timeline Status */}
        <Text style={styles.sectionHeader}>Complaint Progress</Text>
        <Card variant="flat" style={styles.timelineCard}>
          {detail.timeline.map((step, index) => (
            <View key={index} style={styles.timelineItem}>
              {/* Left Column (Line & Dot Indicator) */}
              <View style={styles.leftColumn}>
                <View
                  style={[
                    styles.dot,
                    step.completed ? styles.dotCompleted : styles.dotPending,
                  ]}
                >
                  {step.completed && (
                    <Ionicons name="checkmark" size={10} color={theme.colors.surface} />
                  )}
                </View>
                {index < detail.timeline.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      step.completed ? styles.lineCompleted : styles.linePending,
                    ]}
                  />
                )}
              </View>

              {/* Right Column (Texts) */}
              <View style={styles.rightColumn}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
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
    gap: theme.spacing.lg,
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
    marginBottom: theme.spacing.md,
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
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  timelineCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 80,
  },
  leftColumn: {
    alignItems: "center",
    marginRight: theme.spacing.md,
    width: 20,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  dotCompleted: {
    backgroundColor: theme.colors.success,
  },
  dotPending: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: theme.colors.success,
  },
  linePending: {
    backgroundColor: theme.colors.border,
  },
  rightColumn: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  stepTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
});

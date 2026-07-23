import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetComplaintDetail } from "@repo/operations";
import LoadingScreen from "@/components/layout/loading-screen";
import NotFoundScreen from "@/components/layout/not-found-screen";

const STATUS_VARIANTS: Record<string, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  REJECTED: "danger",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

export default function ComplaintDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: detail, isLoading } = useGetComplaintDetail(id || "");

  if (isLoading) return <LoadingScreen title="Complaint Details" />;
  if (!detail) return <NotFoundScreen title="Complaint" message="Complaint not found" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Complaint Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Card variant="flat" style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryWrapper}>
              <Text style={styles.categoryText}>
                {detail.category.replace(/_/g, " ")}
              </Text>
            </View>
            <Badge variant={STATUS_VARIANTS[detail.status] || "secondary"}>
              {STATUS_LABELS[detail.status] || detail.status}
            </Badge>
          </View>
          <Text style={styles.title}>{detail.subject}</Text>
          <Text style={styles.desc}>{detail.description}</Text>
          <Text style={styles.date}>
            Registered on{" "}
            {detail.createdAt
              ? new Date(detail.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </Text>
          {detail.reportedByUser && (
            <Text style={styles.reportedBy}>
              Reported by: {detail.reportedByUser.firstName} {detail.reportedByUser.lastName}
            </Text>
          )}
        </Card>

        {/* Timeline */}
        {detail.timeline && detail.timeline.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Complaint Progress</Text>
            <Card variant="flat" style={styles.timelineCard}>
              {detail.timeline.map((step, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.leftColumn}>
                    <View
                      style={[
                        styles.dot,
                        step.status !== "PENDING" ? styles.dotCompleted : styles.dotPending,
                      ]}
                    >
                      {step.status !== "PENDING" && (
                        <Ionicons name="checkmark" size={10} color={theme.colors.surface} />
                      )}
                    </View>
                    {index < detail.timeline.length - 1 && (
                      <View
                        style={[
                          styles.line,
                          step.status !== "PENDING" ? styles.lineCompleted : styles.linePending,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.rightColumn}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                    <Text style={styles.stepTime}>
                      {step.createdAt
                        ? new Date(step.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}
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
    paddingBottom: theme.spacing.xxl * 2,
  },
  infoCard: {
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
    marginBottom: theme.spacing.md,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  reportedBy: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
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

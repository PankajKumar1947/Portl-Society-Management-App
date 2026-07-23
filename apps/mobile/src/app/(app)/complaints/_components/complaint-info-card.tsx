import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplaintData } from "@repo/schema";

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

interface ComplaintInfoCardProps {
  complaint: ComplaintData;
}

export default function ComplaintInfoCard({ complaint }: ComplaintInfoCardProps) {
  return (
    <Card variant="flat" style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryWrapper}>
          <Text style={styles.categoryText}>
            {complaint.category.replace(/_/g, " ")}
          </Text>
        </View>
        <Badge variant={STATUS_VARIANTS[complaint.status] || "secondary"}>
          {STATUS_LABELS[complaint.status] || complaint.status}
        </Badge>
      </View>
      <Text style={styles.title}>{complaint.subject}</Text>
      <Text style={styles.desc}>{complaint.description}</Text>
      <Text style={styles.date}>
        Registered on{" "}
        {complaint.createdAt
          ? new Date(complaint.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : ""}
      </Text>
      {complaint.reportedByUser && (
        <Text style={styles.reportedBy}>
          Reported by: {complaint.reportedByUser.firstName} {complaint.reportedByUser.lastName}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
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
});

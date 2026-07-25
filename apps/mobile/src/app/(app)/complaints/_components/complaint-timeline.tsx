import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/date";
import { TimelineEntryData } from "@repo/schema";

interface ComplaintTimelineProps {
  timeline: TimelineEntryData[];
}

export default function ComplaintTimeline({ timeline }: ComplaintTimelineProps) {
  return (
    <>
      <Text style={styles.sectionHeader}>Complaint Progress</Text>
      <Card variant="flat" style={styles.timelineCard}>
        {timeline.map((step, index) => (
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
              {index < timeline.length - 1 && (
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
                {formatDate(step.createdAt, "dateTime")}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
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

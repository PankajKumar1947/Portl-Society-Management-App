import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import Card from "../../components/ui/card";
import Badge from "../../components/ui/badge";

export default function GuardDashboard() {
  const quickActions = [
    { id: "register", title: "Register Visitor", icon: "person-add-outline", color: theme.colors.primaryDark },
    { id: "verify", title: "Verify Pass", icon: "qr-code-outline", color: theme.colors.info },
    { id: "exit", title: "Mark Exit", icon: "log-out-outline", color: theme.colors.danger },
  ];

  const recentLogs = [
    { id: "1", name: "Ramesh Kumar", flat: "B-102", type: "Guest", time: "10 mins ago", status: "entered" },
    { id: "2", name: "Zomato Delivery", flat: "A-402", type: "Delivery", time: "25 mins ago", status: "entered" },
    { id: "3", name: "Urban Company", flat: "C-903", type: "Service Staff", time: "1 hour ago", status: "exited" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.titleText}>Gate Portal</Text>
            <Text style={styles.subText}>Main Entry Guard Station</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        {/* Live Counters */}
        <Card variant="flat" style={styles.metricCard}>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>18</Text>
              <Text style={styles.metricLabel}>Active Visitors</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>45</Text>
              <Text style={styles.metricLabel}>Total Today</Text>
            </View>
          </View>
        </Card>

        {/* Quick Action Tiles */}
        <Text style={styles.sectionTitle}>Gate Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Card
              key={action.id}
              variant="flat"
              onPress={() => console.log(`${action.title} pressed`)}
              style={styles.actionCard}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color + "15" }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </Card>
          ))}
        </View>

        {/* Recent Visitor Entries */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Movements</Text>
          <Text style={styles.seeAllText}>View Log</Text>
        </View>

        <View style={styles.logList}>
          {recentLogs.map((log) => (
            <Card key={log.id} variant="flat" style={styles.logCard}>
              <View style={styles.logContent}>
                <View style={styles.logAvatar}>
                  <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
                </View>
                <View style={styles.logDetails}>
                  <Text style={styles.logName}>{log.name}</Text>
                  <Text style={styles.logSubText}>
                    Flat {log.flat} · {log.type}
                  </Text>
                  <Text style={styles.logTime}>{log.time}</Text>
                </View>
                <Badge variant={log.status === "entered" ? "success" : "secondary"}>
                  {log.status}
                </Badge>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 112,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  titleText: {
    fontSize: 26,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  subText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F9EE",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.success,
  },
  metricCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xl,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  metricLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primaryDark,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionCard: {
    flex: 1,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  logList: {
    gap: theme.spacing.md,
  },
  logCard: {
    backgroundColor: theme.colors.surface,
  },
  logContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  logDetails: {
    flex: 1,
  },
  logName: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  logSubText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  logTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});

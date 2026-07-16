import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import Card from "../../components/ui/card";
import Badge from "../../components/ui/badge";

export default function AdminDashboard() {
  const metrics = [
    { label: "Total Residents", value: "342", icon: "people", color: theme.colors.primaryDark },
    { label: "Pending Approvals", value: "5", icon: "checkmark-circle", color: theme.colors.warning },
    { label: "Open Tickets", value: "12", icon: "help-circle", color: theme.colors.danger },
  ];

  const shortcuts = [
    { title: "Manage Towers & Flats", desc: "View structural units", icon: "business-outline" },
    { title: "Publish Announcements", desc: "Broadcast alerts", icon: "megaphone-outline" },
    { title: "Create Community Poll", desc: "Collect votes", icon: "create-outline" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.titleText}>Admin Portal</Text>
            <Text style={styles.subText}>Portl Society Management</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="settings" size={24} color={theme.colors.text} />
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsContainer}>
          {metrics.map((item, idx) => (
            <Card key={idx} variant="flat" style={styles.metricCard}>
              <View style={[styles.iconCircle, { backgroundColor: item.color + "15" }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.metricValue}>{item.value}</Text>
              <Text style={styles.metricLabel}>{item.label}</Text>
            </Card>
          ))}
        </View>

        {/* Quick Operations Shortcuts */}
        <Text style={styles.sectionTitle}>Operations Shortcuts</Text>
        <View style={styles.shortcutsList}>
          {shortcuts.map((shortcut, idx) => (
            <Card key={idx} variant="flat" style={styles.shortcutCard} onPress={() => {}}>
              <View style={styles.shortcutContent}>
                <View style={styles.shortcutIconContainer}>
                  <Ionicons name={shortcut.icon as any} size={24} color={theme.colors.primaryDark} />
                </View>
                <View style={styles.shortcutTextContainer}>
                  <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                  <Text style={styles.shortcutDesc}>{shortcut.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  metricsContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  metricCard: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: theme.fontWeights.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  shortcutsList: {
    gap: theme.spacing.md,
  },
  shortcutCard: {
    backgroundColor: theme.colors.surface,
  },
  shortcutContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  shortcutIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  shortcutTextContainer: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  shortcutDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
});

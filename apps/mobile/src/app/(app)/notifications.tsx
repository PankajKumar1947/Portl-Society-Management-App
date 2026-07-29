import React, { useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { useGetNotifications, useMarkAllAsRead } from "@repo/operations";
import { formatDate } from "@/utils/date";

const TYPE_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  visitor_request: { icon: "people", bg: "rgba(33, 150, 243, 0.1)", color: theme.colors.info },
  visitor_approved: { icon: "checkmark-circle", bg: "rgba(76, 175, 80, 0.1)", color: theme.colors.success },
  visitor_rejected: { icon: "close-circle", bg: "rgba(244, 67, 54, 0.1)", color: theme.colors.danger ?? "#F44336" },
  general: { icon: "notifications", bg: "rgba(255, 152, 0, 0.1)", color: theme.colors.warning },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { data: notifications = [], isLoading, refetch } = useGetNotifications();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const handleNotificationTap = useCallback(
    (item: { type: string; data?: Record<string, unknown>; notificationId: string }) => {
      if (item.type === "visitor_request" && item.data?.logId) {
        router.push(Routes.Visitors.Approval(item.data.logId as string));
      }
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Notifications"
        onBack={() => router.back()}
        rightElement={
          notifications.length > 0 ? (
            <TouchableOpacity onPress={() => markAllAsRead()} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId}
        contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        }
        renderItem={({ item }) => {
          const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.general;
          return (
            <TouchableOpacity onPress={() => handleNotificationTap(item)}>
              <Card
                variant="flat"
                style={[styles.notificationCard, !item.read && styles.unreadCard]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
                  <Ionicons name={config.icon} size={22} color={config.color} />
                </View>
                <View style={styles.textWrapper}>
                  <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.body}
                  </Text>
                </View>
                <Text style={styles.time}>
                  {item.createdAt ? formatDate(item.createdAt, "time") : ""}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
  },
  unreadCard: {
    backgroundColor: "rgba(33, 150, 243, 0.03)",
    borderColor: "rgba(33, 150, 243, 0.2)",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  unreadTitle: {
    color: theme.colors.text,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  time: {
    fontSize: 11,
    color: theme.colors.textMuted,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  separator: {
    height: theme.spacing.sm,
  },
  markAllBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  markAllText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },
});

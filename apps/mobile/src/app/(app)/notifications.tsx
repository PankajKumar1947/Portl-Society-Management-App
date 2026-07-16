import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Visitor Approved",
    description: "Rahul Sharma has been approved by you.",
    time: "10:30 AM",
    icon: "people",
    iconBg: "rgba(76, 175, 80, 0.1)",
    iconColor: theme.colors.success,
  },
  {
    id: "2",
    title: "New Notice",
    description: "Water maintenance on 15th May.",
    time: "09:00 AM",
    icon: "notifications",
    iconBg: "rgba(255, 152, 0, 0.1)",
    iconColor: theme.colors.warning,
  },
  {
    id: "3",
    title: "Booking Confirmed",
    description: "Club House booking confirmed.",
    time: "Yesterday",
    icon: "checkmark-circle",
    iconBg: "rgba(33, 150, 243, 0.1)",
    iconColor: theme.colors.info,
  },
  {
    id: "4",
    title: "Ticket Updated",
    description: "Your Ticket has been updated.",
    time: "Yesterday",
    icon: "build",
    iconBg: "rgba(96, 125, 139, 0.1)",
    iconColor: theme.colors.textSecondary,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Notifications" onBack={() => router.back()} />

      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card variant="flat" style={styles.notificationCard}>
            <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={22} color={item.iconColor} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </Card>
        )}
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
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
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
});

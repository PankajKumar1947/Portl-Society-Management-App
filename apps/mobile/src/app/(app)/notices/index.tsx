import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { useRouter } from "expo-router";

interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
  isNew: boolean;
}

const NOTICES: Notice[] = [
  {
    id: "1",
    title: "Water Supply Maintenance",
    date: "15 Jul 2026",
    description: "Water supply will be suspended on 16th July from 10 AM to 4 PM for tank cleaning.",
    isNew: true,
  },
  {
    id: "2",
    title: "Annual General Meeting",
    date: "12 Jul 2026",
    description: "AGM scheduled for 20th July at 6 PM in the community hall. All members are requested to attend.",
    isNew: true,
  },
  {
    id: "3",
    title: "Diwali Celebration Event",
    date: "10 Jul 2026",
    description: "Join us for Diwali celebrations on 25th October. Register at the helpdesk for participation.",
    isNew: false,
  },
  {
    id: "4",
    title: "Society Floor Wise Meeting",
    date: "08 Jul 2026",
    description: "Floor wise meeting will be arranged for discussing the renovation plans.",
    isNew: false,
  },
  {
    id: "5",
    title: "Parking Allocation Update",
    date: "05 Jul 2026",
    description: "New parking slots allocated for visitors. Please collect your parking sticker from the security office.",
    isNew: false,
  },
];

export default function NoticesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notices"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Notices.Create)}
            icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {NOTICES.map((notice) => (
          <Card
            key={notice.id}
            variant="outlined"
            style={styles.noticeCard}
            onPress={() => router.push(Routes.Notices.Details(notice.id))}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                {notice.isNew && <View style={styles.newDot} />}
                <Text style={styles.noticeTitle}>{notice.title}</Text>
              </View>
              <Text style={styles.date}>{notice.date}</Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {notice.description}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl * 2,
  },
  noticeCard: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    flexShrink: 1,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});

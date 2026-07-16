import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { FileCard } from "@/components/ui/file-card";

interface Attachment {
  title: string;
  size: string;
  icon?: "document-text-outline" | "image-outline" | "document-outline";
}

interface Publisher {
  name: string;
  role: string;
}

interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
  isNew: boolean;
  publishedBy: Publisher;
  attachments?: Attachment[];
}

const NOTICES: Notice[] = [
  {
    id: "1",
    title: "Water Supply Maintenance",
    date: "15 Jul 2026",
    description: "Water supply will be suspended on 16th July from 10 AM to 4 PM for tank cleaning. Residents are requested to store adequate water for the duration. The maintenance team will resume supply as soon as the cleaning is complete. We apologize for the inconvenience.",
    isNew: true,
    publishedBy: { name: "Sunita Sharma", role: "Admin" },
    attachments: [
      { title: "Maintenance_Schedule.pdf", size: "2.4 MB", icon: "document-text-outline" },
    ],
  },
  {
    id: "2",
    title: "Annual General Meeting",
    date: "12 Jul 2026",
    description: "AGM scheduled for 20th July at 6 PM in the community hall. All members are requested to attend. The agenda includes budget approval, committee elections, and discussion on upcoming renovation projects.",
    isNew: true,
    publishedBy: { name: "Rajesh Patel", role: "Admin" },
    attachments: [
      { title: "AGM_Agenda.pdf", size: "1.1 MB", icon: "document-text-outline" },
      { title: "Meeting_Minutes_2025.pdf", size: "3.2 MB", icon: "document-text-outline" },
    ],
  },
  {
    id: "3",
    title: "Diwali Celebration Event",
    date: "10 Jul 2026",
    description: "Join us for Diwali celebrations on 25th October. Register at the helpdesk for participation. There will be cultural performances, food stalls, and a lamp lighting ceremony.",
    isNew: false,
    publishedBy: { name: "Vikram Singh", role: "Guard" },
  },
  {
    id: "4",
    title: "Society Floor Wise Meeting",
    date: "08 Jul 2026",
    description: "Floor wise meeting will be arranged for discussing the renovation plans for each tower. Please check the notice board for your floor's scheduled time slot.",
    isNew: false,
    publishedBy: { name: "Sunita Sharma", role: "Admin" },
  },
  {
    id: "5",
    title: "Parking Allocation Update",
    date: "05 Jul 2026",
    description: "New parking slots allocated for visitors. Please collect your parking sticker from the security office. Residents with multiple vehicles must register the additional vehicle details at the admin office.",
    isNew: false,
    publishedBy: { name: "Anil Kumar", role: "Guard" },
  },
];

export default function NoticeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();

  const notice = NOTICES.find((n) => n.id === id);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (!notice) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Notice Details" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Notice not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notice Details"
        onBack={() => router.push(Routes.Notices.Index)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textMuted} />
          <Text style={styles.date}>{notice.date}</Text>
        </View>

        <Card variant="outlined" style={styles.detailCard}>
          <View style={styles.headerRow}>
            {notice.isNew && <View style={styles.newDot} />}
            <Text style={styles.title}>{notice.title}</Text>
          </View>
          <View style={styles.publisherRow}>
            <View style={styles.publisherAvatar}>
              <Ionicons name="person" size={16} color={theme.colors.primaryDark} />
            </View>
            <View style={styles.publisherInfo}>
              <Text style={styles.publisherName}>{notice.publishedBy.name}</Text>
              <Text style={styles.publisherRole}>{notice.publishedBy.role}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.description}>{notice.description}</Text>

          {notice.attachments && notice.attachments.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Attachments</Text>
              {notice.attachments.map((file, index) => (
                <FileCard
                  key={index}
                  title={file.title}
                  size={file.size}
                  icon={file.icon}
                />
              ))}
            </>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  detailCard: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  newDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
  publisherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  publisherAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  publisherInfo: {
    flex: 1,
  },
  publisherName: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  publisherRole: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  date: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
});

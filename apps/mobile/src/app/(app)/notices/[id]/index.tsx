import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import { IconButton } from "@/components/ui/icon-button";
import { Card } from "@/components/ui/card";
import { FileCard } from "@/components/ui/file-card";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { useGetNoticeDetail, usePublishNotice } from "@repo/operations";
import { formatDate, roleLabel } from "@/utils/notice";

const RECIPIENT_LABELS: Record<string, { label: string; variant: "success" | "warning" }> = {
  residents: { label: "Residents", variant: "success" },
  guard: { label: "Guards", variant: "warning" },
};

export default function NoticeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { data: notice, isLoading } = useGetNoticeDetail(id ?? "", { enabled: !!id });
  const { mutate: publishNotice, isPending: isPublishing } = usePublishNotice(id ?? "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isLoading) {
    return <LoadingScreen title="Notice Details" onBack={() => router.back()} />;
  }

  if (!notice) {
    return <NotFoundScreen title="Notice Details" message="Notice not found" onBack={() => router.back()} />;
  }

  const displayDate = formatDate(notice.publishedOn || notice.createdAt);
  const publisherName = notice.publisher
    ? `${notice.publisher.firstName} ${notice.publisher.lastName}`
    : "";
  const publisherRole = roleLabel(notice.publisher?.role);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notice Details"
        onBack={() => router.back()}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Notices.Edit(notice.noticeId))}
            icon={<Ionicons name="pencil-outline" size={22} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textMuted} />
          <Text style={styles.date}>{displayDate}</Text>
        </View>

        <Card variant="outlined" style={styles.detailCard}>
          <View style={styles.headerRow}>
            {notice.status === "published" && <View style={styles.newDot} />}
            <Text style={styles.title}>{notice.title}</Text>
          </View>
          <View style={styles.publisherRow}>
            <View style={styles.publisherAvatar}>
              <Ionicons name="person" size={16} color={theme.colors.primaryDark} />
            </View>
            <View style={styles.publisherInfo}>
              <Text style={styles.publisherName}>{publisherName}</Text>
              <Text style={styles.publisherRole}>{publisherRole}</Text>
            </View>
          </View>

          <View style={styles.recipientRow}>
            {notice.recipient?.map((r) => {
              const config = RECIPIENT_LABELS[r];
              return config ? (
                <Badge key={r} variant={config.variant}>{config.label}</Badge>
              ) : null;
            })}
          </View>

          <View style={styles.divider} />
          <Text style={styles.description}>{notice.description}</Text>

          {notice.attachment && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Attachments</Text>
              <FileCard
                title={notice.attachment}
                size=""
                icon="document-text-outline"
              />
            </>
          )}

          {notice.status === "draft" && (
            <>
              <View style={styles.divider} />
              <Button
                onPress={() => publishNotice()}
                loading={isPublishing}
                disabled={isPublishing}
                style={styles.publishButton}
              >
                Publish Notice
              </Button>
            </>
          )}
        </Card>
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
    paddingBottom: theme.spacing.xxl * 2,
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
  recipientRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
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
  publishButton: {
    marginTop: theme.spacing.sm,
    height: 48,
  },
});

import React, { useLayoutEffect, useState } from "react";
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
import { DocumentPreviewModal } from "@/components/common/document-preview-modal";
import { useGetNoticeDetail, usePublishNotice, useAccessControl } from "@repo/operations";
import { formatDate, roleLabel } from "@/utils/notice";
import { MediaData, AclResource } from "@repo/schema";

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
  const { canUpdate, canDelete } = useAccessControl(AclResource.NOTICES);

  const [selectedFile, setSelectedFile] = useState<MediaData | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

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

  const handlePreviewFile = (file: MediaData) => {
    setSelectedFile(file);
    setIsPreviewVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Notice Details"
        onBack={() => router.back()}
        rightElement={
          canUpdate && (
            <IconButton
              onPress={() => router.push(Routes.Notices.Edit(notice.noticeId))}
              icon={<Ionicons name="pencil-outline" size={22} color={theme.colors.text} />}
              variant="ghost"
              size="md"
            />
          )
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="flat" style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.badgeRow}>
                <View style={styles.statusDot} />
                <Text style={styles.title}>{notice.title}</Text>
              </View>
              <Text style={styles.date}>{displayDate}</Text>
            </View>
          </View>

          <View style={styles.divider} />

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

          {notice.attachmentList && notice.attachmentList.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Attachments</Text>
              {notice.attachmentList.map((file: MediaData) => (
                <FileCard
                  key={file.mediaId}
                  title={file.fileName}
                  size={file.sizeBytes ? `${(file.sizeBytes / 1024).toFixed(1)} KB` : ""}
                  icon="document-text-outline"
                  onPress={() => handlePreviewFile(file)}
                />
              ))}
            </>
          )}

          {canUpdate && notice.status === "draft" && (
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

      {selectedFile && (
        <DocumentPreviewModal
          visible={isPreviewVisible}
          onClose={() => setIsPreviewVisible(false)}
          fileUrl={selectedFile.url}
          fileName={selectedFile.fileName}
          mimeType={selectedFile.mimeType}
        />
      )}
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
  },
  card: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  publisherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  publisherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    marginTop: 1,
  },
  recipientRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  publishButton: {
    marginTop: theme.spacing.sm,
    height: 48,
  },
});

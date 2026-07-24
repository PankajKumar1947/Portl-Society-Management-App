import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useGetComplaintDetail, useUpdateComplaint, useAddComplaintTimelineEntry, useAccessControl } from "@repo/operations";
import { ComplaintStatus, AclResource } from "@repo/schema";
import LoadingScreen from "@/components/layout/loading-screen";
import NotFoundScreen from "@/components/layout/not-found-screen";
import ComplaintInfoCard from "./_components/complaint-info-card";
import ComplaintAdminActions from "./_components/complaint-admin-actions";
import ComplaintTimeline from "./_components/complaint-timeline";

export default function ComplaintDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: detail, isLoading } = useGetComplaintDetail(id || "");
  const { mutateAsync: updateComplaint, isPending: isUpdating } = useUpdateComplaint(id || "");
  const { mutateAsync: addTimelineEntry, isPending: isAddingEntry } = useAddComplaintTimelineEntry(id || "");

  const { canUpdate } = useAccessControl(AclResource.COMPLAINTS);

  const handleStatusUpdate = async (newStatus: ComplaintStatus) => {
    await updateComplaint({ status: newStatus });
  };

  const handleAddTimeline = async (title: string, description: string) => {
    await addTimelineEntry({ title, description });
  };

  if (isLoading) return <LoadingScreen title="Complaint Details" />;
  if (!detail) return <NotFoundScreen title="Complaint" message="Complaint not found" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Complaint Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ComplaintInfoCard complaint={detail} />

        {detail.timeline && detail.timeline.length > 0 && (
          <ComplaintTimeline timeline={detail.timeline} />
        )}

        {canUpdate && (
          <ComplaintAdminActions
            currentStatus={detail.status}
            isUpdating={isUpdating}
            onStatusUpdate={handleStatusUpdate}
            onAddTimeline={handleAddTimeline}
          />
        )}
      </ScrollView>
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
    gap: theme.spacing.lg,
    paddingBottom: 100,
  },
});

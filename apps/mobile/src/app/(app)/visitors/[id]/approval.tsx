import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { InfoRow } from "@/components/ui/info-row";
import { Button } from "@/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGetVisitorDetail, useUpdateVisitorStatus, useAccessControl, useGetTowers } from "@repo/operations";
import { AclResource, VISITOR_STATUS } from "@repo/schema";
import { formatDate } from "@/utils/date";

function CountdownTimer({ seconds: initial }: { seconds: number }) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const urgent = seconds < 30;

  return (
    <Text style={[styles.timer, urgent && styles.timerUrgent]}>
      ⏱ {mm}:{ss} remaining
    </Text>
  );
}

export default function ApprovalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState("");

  const { data: visitor } = useGetVisitorDetail(id || "", { enabled: !!id });
  const { mutate: updateStatus } = useUpdateVisitorStatus(id || "");
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | null>(null);

  const handleApprove = () => {
    setPendingAction("approve");
    updateStatus(VISITOR_STATUS.APPROVED, {
      onSuccess: (res) => {
        router.replace({
          pathname: "/visitors/[id]/pass",
          params: {
            id: res.data.logId,
            name: res.data.name,
            type: res.data.type,
            date: "Today",
            time: "Approved Pass",
            status: res.data.status,
            passId: res.data.passCode || "N/A",
          }
        });
      },
      onSettled: () => setPendingAction(null),
    });
  };

  const handleDecline = () => {
    setPendingAction("decline");
    updateStatus(VISITOR_STATUS.REJECTED, {
      onSuccess: () => {
        router.replace(Routes.Visitors.Index);
      },
      onSettled: () => setPendingAction(null),
    });
  };

  const { canViewModule } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const shouldFetchTowers = canViewTower || canViewFlat;
  const { data: towers = [] } = useGetTowers({ enabled: shouldFetchTowers });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  const name = visitor?.name || "Visitor";
  const type = visitor?.type ? visitor.type.charAt(0).toUpperCase() + visitor.type.slice(1) : "Guest";
  const purpose = visitor?.purpose || "Personal Visit";
  const timeStr = visitor?.createdAt
    ? `Today, ${formatDate(visitor.createdAt, "time")}`
    : "Today, 04:00 PM";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Approval Request" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Visitor identity */}
        <Card variant="flat" style={styles.visitorCard}>
          <View style={styles.visitorRow}>
            <Avatar name={name} size="lg" />
            <View style={styles.visitorInfo}>
              <Text style={styles.visitorName}>{name}</Text>
              <Text style={styles.visitorRole}>{type}</Text>
            </View>
          </View>
        </Card>

        {/* Details */}
        <Card variant="flat" style={styles.detailCard}>
          {shouldFetchTowers && visitor?.flat && canViewFlat && (
            <>
              {canViewTower && towerMap.get(visitor.flat.towerId) && (
                <InfoRow icon="business-outline" label="Tower" value={towerMap.get(visitor.flat.towerId) || ""} />
              )}
              <InfoRow icon="home-outline" label="Flat" value={visitor.flat.flatNumber} />
              <View style={styles.divider} />
            </>
          )}
          <InfoRow icon="document-text-outline" label="Purpose" value={purpose} />
          <View style={styles.divider} />
          <InfoRow icon="time-outline" value={timeStr} />
        </Card>

        {/* Countdown */}
        <CountdownTimer seconds={120} />

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            style={{ flex: 1, height: 50, borderColor: theme.colors.danger }}
            onPress={handleDecline}
            loading={pendingAction === "decline"}
            disabled={pendingAction !== null}
          >
            Decline
          </Button>
          <Button
            style={{ flex: 1, height: 50 }}
            onPress={handleApprove}
            loading={pendingAction === "approve"}
            disabled={pendingAction !== null}
          >
            Approve
          </Button>
        </View>

        {/* Optional note */}
        <View style={styles.noteBlock}>
          <Text style={styles.noteLabel}>Additional Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note for security"
            placeholderTextColor={theme.colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        <Button
          variant="outline"
          onPress={() => { }}
          style={styles.sendBtn}
        >
          Send
        </Button>
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  visitorCard: {
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.sm,
  },
  visitorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  visitorRole: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  detailCard: {
    backgroundColor: theme.colors.surface,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  timer: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  timerUrgent: {
    color: theme.colors.danger ?? "#E53935",
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 50,
  },
  declineBtn: {
    borderColor: theme.colors.danger ?? "#E53935",
  },
  noteBlock: {
    gap: theme.spacing.xs,
  },
  noteLabel: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  noteInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minHeight: 80,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlignVertical: "top",
  },
  sendBtn: {
    height: 50,
  },
});

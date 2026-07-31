import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { VisitorStatusBadge } from "../_components/visitor-status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { formatDate } from "@/utils/date";
import { useGetVisitorDetail, useGetVisitorVisits, useAccessControl, useGetTowers, useUpdateVisitorStatus } from "@repo/operations";
import { AclResource, VISITOR_STATUS } from "@repo/schema";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";


export default function VisitorPassScreen() {
  const {
    id,
    name: paramName,
    type: paramType,
    date: paramDate,
    time: paramTime,
    status: paramStatus,
    passId: paramPassId
  } = useLocalSearchParams<{
    id: string;
    name: string;
    type: string;
    date: string;
    time: string;
    status: string;
    passId: string;
  }>();

  const { data: visitor, refetch: refetchDetail } = useGetVisitorDetail(id || "", { enabled: !!id });
  const { data: visits = [], refetch: refetchVisits } = useGetVisitorVisits(id || "", { enabled: !!id });

  useFocusEffect(
    React.useCallback(() => {
      refetchDetail();
      refetchVisits();
    }, [refetchDetail, refetchVisits])
  );

  const scanEvents = useMemo(() => {
    const events: Array<{
      id: string;
      timestamp: string;
      action: "ENTRY" | "EXIT";
    }> = [];

    for (const v of visits) {
      for (const entry of v.entries || []) {
        if (entry.enteredAt) {
          events.push({
            id: `${v.logId}-entry-${entry.enteredAt}`,
            timestamp: entry.enteredAt,
            action: "ENTRY",
          });
        }
        if (entry.exitedAt) {
          events.push({
            id: `${v.logId}-exit-${entry.exitedAt}`,
            timestamp: entry.exitedAt,
            action: "EXIT",
          });
        }
      }
    }

    return events.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      if (timeA !== timeB) {
        return timeB - timeA;
      }
      if (a.action === b.action) return 0;
      return a.action === "EXIT" ? -1 : 1;
    });
  }, [visits]);

  const { canViewModule, isResident } = useAccessControl();
  const { mutate: updateStatus } = useUpdateVisitorStatus(id || "");
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | null>(null);

  const handleApprove = () => {
    setPendingAction("approve");
    updateStatus(VISITOR_STATUS.APPROVED, {
      onSettled: () => setPendingAction(null),
    });
  };

  const handleDecline = () => {
    setPendingAction("decline");
    updateStatus(VISITOR_STATUS.REJECTED, {
      onSettled: () => setPendingAction(null),
    });
  };
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const shouldFetchTowers = canViewTower || canViewFlat;
  const { data: towers = [] } = useGetTowers({ enabled: shouldFetchTowers });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  const name = visitor?.name || paramName || "Visitor";
  const type = (visitor?.type || paramType || "Guest").toUpperCase();
  const entries = visitor?.entries || [];
  const latestEntry = entries[entries.length - 1];
  const entryDate = latestEntry?.enteredAt ? formatDate(latestEntry.enteredAt) : null;
  const entryTime = latestEntry?.enteredAt ? formatDate(latestEntry.enteredAt, "time") : null;
  const date = entryDate || paramDate || "Today";
  const time = entryTime || paramTime || "Pending Arrival";
  const status = visitor?.status || paramStatus || VISITOR_STATUS.APPROVED;
  const passId = visitor?.passCode || paramPassId || "VP00000000";
  const createdAt = visitor?.createdAt ? formatDate(visitor.createdAt, "dateTime") : null;

  const viewRef = useRef<View>(null);

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.95,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: `Share Pass`,
      });
    } catch (error) {
      console.error("Failed to capture and share pass image:", error);
      await Share.share({
        message: `My Visitor Pass ID: ${passId}\nShow this at the gate.`,
      });
    }
  };

  const isApproved = status === VISITOR_STATUS.APPROVED || status === VISITOR_STATUS.COMPLETED;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Visitor Details" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pass Card */}
        <View ref={viewRef} collapsable={false} style={{ backgroundColor: theme.colors.background }}>
          <Card variant="flat" style={styles.passCard}>
            <View style={styles.badgeRow}>
              <VisitorStatusBadge
                status={status}
                isResidentCategory={type === "RESIDENT" || type === "FAMILY_MEMBER"}
              />
            </View>

            <View style={styles.visitorBlock}>
              <Text style={styles.visitorName}>{name}</Text>
              <Text style={styles.visitorType}>{type}</Text>
            </View>

            <View style={styles.detailsBlock}>
              <View style={styles.detailsRow}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.detailsText}>
                  {time === "Pending Arrival" ? `${date} (${time})` : `${date}, ${time}`}
                </Text>
              </View>

              {shouldFetchTowers && visitor?.flat && (
                <View style={styles.detailsRow}>
                  <Ionicons name="business-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.detailsText}>
                    {canViewTower && towerMap.get(visitor.flat.towerId) ? `${towerMap.get(visitor.flat.towerId)} • ` : ''}Flat {visitor.flat.flatNumber}
                  </Text>
                </View>
              )}
            </View>

            {status === VISITOR_STATUS.PENDING && passId === "N/A" ? (
              <View style={styles.pendingContainer}>
                <ActivityIndicator size="large" color={theme.colors.warning} />
                <Text style={styles.pendingText}>Waiting for Resident Approval</Text>
              </View>
            ) : isResident && passId && passId !== "N/A" ? (
              <View style={styles.qrWrapperStyles}>
                <QRCode value={passId} size={200} backgroundColor={theme.colors.surface} color={theme.colors.text} />
              </View>
            ) : null}

            {isResident && passId && passId !== "N/A" && (
              <View style={styles.passIdRow}>
                <Text style={styles.passIdLabel}>Pass ID: </Text>
                <Text style={styles.passId}>{passId}</Text>
              </View>
            )}

            {isResident && passId && passId !== "N/A" && (
              <View style={styles.hintContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={status === VISITOR_STATUS.PENDING ? theme.colors.warning : theme.colors.textMuted}
                />
                <Text style={[styles.hint, status === VISITOR_STATUS.PENDING && { color: theme.colors.warning }]}>
                  {status === VISITOR_STATUS.PENDING
                    ? "Approval required on arrival"
                    : "Show this pass at the gate"}
                </Text>
              </View>
            )}

            {isResident && passId && passId !== "N/A" && (
              <Button onPress={handleShare} style={styles.shareBtn}>
                Share Pass
              </Button>
            )}
          </Card>
        </View>

        {/* Activity History */}
        {scanEvents.length > 0 && (
          <Card variant="flat" style={styles.pastVisitsCard}>
            <View style={styles.pastVisitsHeader}>
              <View style={styles.pastVisitsHeaderLeft}>
                <Text style={styles.sectionTitle}>Activity History</Text>
                <View style={styles.pastVisitsCount}>
                  <Text style={styles.pastVisitsCountText}>{scanEvents.length}</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.pastVisitsList}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 2 }]}>Date</Text>
                <Text style={[styles.headerCell, { flex: 2 }]}>Time</Text>
                <Text style={[styles.headerCell, { flex: 1, textAlign: "right" }]}>Type</Text>
              </View>
              {scanEvents.map((event, idx) => (
                <View
                  key={event.id}
                  style={[styles.tableRow, idx < scanEvents.length - 1 && styles.pastVisitCardBorder]}
                >
                  <Text style={[styles.cellText, { flex: 2 }]}>
                    {formatDate(event.timestamp, "short")}
                  </Text>
                  <Text style={[styles.cellText, { flex: 2 }]}>
                    {formatDate(event.timestamp, "time")}
                  </Text>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Badge variant={event.action === "ENTRY" ? "success" : "warning"} style={styles.smallBadge}>
                      {event.action === "ENTRY" ? "IN" : "OUT"}
                    </Badge>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {status === VISITOR_STATUS.PENDING && isResident && (
          <View style={styles.approvalRow}>
            <Button
              onPress={handleDecline}
              variant="danger"
              style={styles.approvalBtn}
              loading={pendingAction === "decline"}
              disabled={pendingAction !== null}
            >
              Decline
            </Button>
            <Button
              onPress={handleApprove}
              variant="primary"
              style={styles.approvalBtn}
              loading={pendingAction === "approve"}
              disabled={pendingAction !== null}
            >
              Approve
            </Button>
          </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 120,
  },
  passCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    alignItems: "center",
    gap: theme.spacing.lg,
    borderRadius: theme.radius.lg,
  },
  badgeRow: {
    alignItems: "center",
  },
  visitorBlock: {
    alignItems: "center",
  },
  visitorName: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  visitorType: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  detailsBlock: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm * 1.5,
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
    gap: 8,
    width: "100%",
    marginTop: theme.spacing.xs,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  passIdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passIdLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  passId: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  shareBtn: {
    height: 52,
    width: "100%",
    marginTop: theme.spacing.lg,
  },

  historyCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  pastVisitsCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  pastVisitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  pastVisitsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  pastVisitsCount: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pastVisitsCountText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textMuted,
  },
  pastVisitsList: {
    gap: theme.spacing.sm,
  },
  pastVisitCard: {
    paddingVertical: theme.spacing.sm,
  },
  pastVisitCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pastVisitTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  cellText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.medium,
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  qrWrapperStyles: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pendingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  pendingText: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.warning,
    textAlign: "center",
  },
  approvalRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  approvalBtn: {
    flex: 1,
  },
});

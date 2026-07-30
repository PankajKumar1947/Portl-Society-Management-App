import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { InfoRow } from "@/components/ui/info-row";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Routes } from "@/constants/routes";
import { formatDate } from "@/utils/date";
import { useGetVisitorDetail, useGetVisitorVisits, useAccessControl, useGetTowers, useUpdateVisitorStatus } from "@repo/operations";
import { AclResource, VISITOR_STATUS } from "@repo/schema";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "secondary"> = {
  [VISITOR_STATUS.APPROVED]: "success",
  [VISITOR_STATUS.PENDING]: "warning",
  [VISITOR_STATUS.REJECTED]: "danger",
  [VISITOR_STATUS.COMPLETED]: "secondary",
};

export default function VisitorPassScreen() {
  const router = useRouter();
  const [showPastVisits, setShowPastVisits] = useState(false);
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

  const pastVisits = useMemo(() => visits.filter((v) => v.logId !== id), [visits, id]);

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
  const purpose = visitor?.purpose || "—";
  const entries = visitor?.entries || [];
  const latestEntry = entries[entries.length - 1];
  const entryDate = latestEntry?.enteredAt ? formatDate(latestEntry.enteredAt) : null;
  const entryTime = latestEntry?.enteredAt ? formatDate(latestEntry.enteredAt, "time") : null;
  const date = entryDate || paramDate || "Today";
  const time = entryTime || paramTime || "Pending Arrival";
  const status = visitor?.status || paramStatus || VISITOR_STATUS.APPROVED;
  const passId = visitor?.passCode || paramPassId || "VP00000000";
  const createdAt = visitor?.createdAt ? formatDate(visitor.createdAt, "dateTime") : null;

  const handleShare = async () => {
    await Share.share({
      message: `My Visitor Pass ID: ${passId}\nShow this at the gate.`,
    });
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
        <Card variant="flat" style={styles.passCard}>
          <View style={styles.badgeRow}>
            <Badge variant={isApproved ? "success" : "warning"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
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
          ) : passId && passId !== "N/A" ? (
            <View style={styles.qrWrapperStyles}>
              <QRCode value={passId} size={200} backgroundColor={theme.colors.surface} color={theme.colors.text} />
            </View>
          ) : null}

          {passId && passId !== "N/A" && (
            <View style={styles.passIdRow}>
              <Text style={styles.passIdLabel}>Pass ID: </Text>
              <Text style={styles.passId}>{passId}</Text>
            </View>
          )}

          {passId && passId !== "N/A" && (
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
        </Card>

        {/* Visit Timeline */}
        <Card variant="flat" style={styles.historyCard}>
          <Text style={styles.sectionTitle}>Visit Timeline</Text>
          <View style={styles.divider} />
          {createdAt && (
            <InfoRow
              icon="add-circle-outline"
              label="Requested"
              value={createdAt}
            />
          )}
          {entries.map((entry, idx) => (
            <View key={idx}>
              {entry.enteredAt && (
                <InfoRow
                  icon="checkmark-circle-outline"
                  label={idx === 0 && entries.length > 1 ? `Entry ${idx + 1}` : "Entered"}
                  value={formatDate(entry.enteredAt, "dateTime")}
                />
              )}
              {entry.exitedAt && (
                <InfoRow
                  icon="exit-outline"
                  label={idx === 0 && entries.length > 1 ? `Exit ${idx + 1}` : "Exited"}
                  value={formatDate(entry.exitedAt, "dateTime")}
                />
              )}
            </View>
          ))}
          {visitor?.status === VISITOR_STATUS.REJECTED && (
            <InfoRow
              icon="close-circle-outline"
              label="Status"
              value="Rejected"
            />
          )}
        </Card>

        {/* Past Visits */}
        {pastVisits.length > 0 && (
          <Card variant="flat" style={styles.pastVisitsCard}>
            <TouchableOpacity
              style={styles.pastVisitsHeader}
              onPress={() => setShowPastVisits((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={styles.pastVisitsHeaderLeft}>
                <Text style={styles.sectionTitle}>Past Visits</Text>
                <View style={styles.pastVisitsCount}>
                  <Text style={styles.pastVisitsCountText}>{pastVisits.length}</Text>
                </View>
              </View>
              <Ionicons
                name={showPastVisits ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            {showPastVisits && (
              <View style={styles.pastVisitsList}>
                {pastVisits.map((visit, idx) => {
                  const firstEntry = visit.entries?.[0];
                  return (
                    <TouchableOpacity
                      key={visit.logId}
                      style={[styles.pastVisitCard, idx < pastVisits.length - 1 && styles.pastVisitCardBorder]}
                      onPress={() => router.push(Routes.Visitors.Pass(visit.logId))}
                      activeOpacity={0.7}
                    >
                      <View style={styles.pastVisitTop}>
                        <Text style={styles.pastVisitDate}>
                          {formatDate(visit.createdAt, "withWeekday")}
                        </Text>
                        <Badge variant={STATUS_VARIANT[visit.status]}>
                          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        </Badge>
                      </View>
                      <View style={styles.pastVisitTimeline}>
                        <Text style={styles.pastVisitPassId}>Pass: {visit.passCode || "N/A"}</Text>
                        {firstEntry?.enteredAt && (
                          <View style={styles.pastVisitEntryRow}>
                            <View style={[styles.pastVisitDot, styles.entryDotPast]} />
                            <Text style={styles.pastVisitTime}>
                              IN {formatDate(firstEntry.enteredAt, "time")}
                            </Text>
                          </View>
                        )}
                        {firstEntry?.exitedAt && (
                          <View style={styles.pastVisitEntryRow}>
                            <View style={[styles.pastVisitDot, styles.exitDotPast]} />
                            <Text style={styles.pastVisitTime}>
                              OUT {formatDate(firstEntry.exitedAt, "time")}
                            </Text>
                          </View>
                        )}
                      </View>
                      {idx < pastVisits.length - 1 && <View style={styles.pastVisitConnector} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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

        {passId && passId !== "N/A" && (
          <Button onPress={handleShare} style={styles.shareBtn}>
            Share Pass
          </Button>
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
  pastVisitDate: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  pastVisitTimeline: {
    gap: 3,
  },
  pastVisitPassId: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  pastVisitEntryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pastVisitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  entryDotPast: {
    backgroundColor: theme.colors.success,
  },
  exitDotPast: {
    backgroundColor: theme.colors.warning,
  },
  pastVisitTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  pastVisitConnector: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.sm,
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

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { InfoRow } from "@/components/ui/info-row";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

/** Styled QR-code placeholder — replace View with QRCode from
 *  react-native-qrcode-svg once the library is installed. */
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGetVisitorDetail, useAccessControl, useGetTowers } from "@repo/operations";
import { AclResource } from "@repo/schema";

/** Styled QR-code placeholder — replace View with QRCode from
 *  react-native-qrcode-svg once the library is installed. */
function QRPlaceholder({ value }: { value: string }) {
  const CELL = 7;
  const GRID = 17;
  // pseudo-random deterministic pattern from value characters
  const seed = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells = Array.from({ length: GRID * GRID }, (_, i) => {
    const r = Math.floor(i / GRID);
    const c = i % GRID;
    // corner finder patterns
    if ((r < 3 && c < 3) || (r < 3 && c >= GRID - 3) || (r >= GRID - 3 && c < 3)) {
      return true;
    }
    // pseudo-random fill
    return (((seed * (i + 1) * 31) ^ (i * 17)) & 1) === 1;
  });

  return (
    <View style={qrStyles.wrapper}>
      <View style={qrStyles.grid}>
        {cells.map((filled, i) => (
          <View
            key={i}
            style={[
              qrStyles.cell,
              { width: CELL, height: CELL },
              filled ? qrStyles.dark : qrStyles.light,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const qrStyles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 7 * 17,
  },
  cell: {},
  dark: { backgroundColor: "#000" },
  light: { backgroundColor: "#fff" },
});

export default function VisitorPassScreen() {
  const router = useRouter();
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

  const { data: visitor } = useGetVisitorDetail(id || "", { enabled: !!id });

  const { canViewModule } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const shouldFetchTowers = canViewTower || canViewFlat;
  const { data: towers = [] } = useGetTowers({ enabled: shouldFetchTowers });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  const name = visitor?.name || paramName || "Visitor";
  const type = (visitor?.type || paramType || "Guest").toUpperCase();
  const purpose = visitor?.purpose || "—";
  const date = visitor?.visitedAt ? new Date(visitor.visitedAt).toLocaleDateString() : (paramDate || "Today");
  const time = visitor?.visitedAt ? new Date(visitor.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (paramTime || "Pending Arrival");
  const status = visitor?.status || paramStatus || "approved";
  const passId = visitor?.passCode || paramPassId || "VP00000000";
  const visitedAt = visitor?.visitedAt ? new Date(visitor.visitedAt).toLocaleString() : null;
  const exitedAt = visitor?.exitedAt ? new Date(visitor.exitedAt).toLocaleString() : null;
  const createdAt = visitor?.createdAt ? new Date(visitor.createdAt).toLocaleString() : null;

  const handleShare = async () => {
    await Share.share({
      message: `My Visitor Pass ID: ${passId}\nShow this at the gate.`,
    });
  };

  const isApproved = status === "approved" || status === "success";

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

          <View style={styles.infoRowContainer}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} style={styles.calendarIcon} />
            <View style={styles.timeBlock}>
              <Text style={styles.timeValue}>{date}</Text>
              <Text style={styles.timeValue}>{time}</Text>
            </View>
          </View>

          {shouldFetchTowers && visitor?.flat && (
            <View style={styles.locationRow}>
              {canViewTower && towerMap.get(visitor.flat.towerId) && (
                <InfoRow icon="business-outline" label="Tower" value={towerMap.get(visitor.flat.towerId) || ""} />
              )}
              {canViewFlat && (
                <InfoRow icon="home-outline" label="Flat" value={visitor.flat.flatNumber} />
              )}
            </View>
          )}

          <QRPlaceholder value={passId} />

          <View style={styles.passIdRow}>
            <Text style={styles.passIdLabel}>Pass ID: </Text>
            <Text style={styles.passId}>{passId}</Text>
          </View>

          <View style={styles.hintContainer}>
            <Ionicons name="alert-circle-outline" size={14} color={theme.colors.textMuted} />
            <Text style={styles.hint}>Show this pass at the gate</Text>
          </View>
        </Card>

        {/* Visitor History */}
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
          {visitor?.status === "approved" && visitedAt && (
            <InfoRow
              icon="checkmark-circle-outline"
              label="Entered"
              value={visitedAt}
            />
          )}
          {visitor?.status === "completed" && exitedAt && (
            <InfoRow
              icon="exit-outline"
              label="Exited"
              value={exitedAt}
            />
          )}
          {visitor?.status === "rejected" && (
            <InfoRow
              icon="close-circle-outline"
              label="Status"
              value="Rejected"
            />
          )}
        </Card>

        <Button onPress={handleShare} style={styles.shareBtn}>
          Share Pass
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
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
  infoRowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    width: "100%",
    paddingHorizontal: theme.spacing.md,
  },
  calendarIcon: {
    marginTop: 2,
  },
  timeBlock: {
    gap: 4,
  },
  timeValue: {
    fontSize: 15,
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
  locationRow: {
    flexDirection: "column",
    gap: theme.spacing.xs,
    width: "100%",
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
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
});

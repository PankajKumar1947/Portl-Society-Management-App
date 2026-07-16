import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
} from "react-native";
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
    name = "Rahul Sharma",
    type = "Delivery Partner",
    date = "Today, 15 May 2024",
    time = "10:00 AM – 11:00 AM",
    status = "approved",
    passId = "VP12345678"
  } = useLocalSearchParams<{
    id: string;
    name: string;
    type: string;
    date: string;
    time: string;
    status: string;
    passId: string;
  }>();

  const handleShare = async () => {
    await Share.share({
      message: `My Visitor Pass ID: ${passId}\nShow this at the gate.`,
    });
  };

  const isApproved = status === "approved" || status === "success";

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Visitor Pass" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="flat" style={styles.passCard}>
          <View style={styles.badgeRow}>
            <Badge variant={isApproved ? "success" : "warning"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </View>

          {/* Visitor info */}
          <View style={styles.visitorBlock}>
            <Text style={styles.visitorName}>{name}</Text>
            <Text style={styles.visitorType}>{type}</Text>
          </View>

          {/* Date / time */}
          <View style={styles.infoRowContainer}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} style={styles.calendarIcon} />
            <View style={styles.timeBlock}>
              <Text style={styles.timeValue}>{date}</Text>
              <Text style={styles.timeValue}>{time}</Text>
            </View>
          </View>

          {/* QR code */}
          <QRPlaceholder value={passId} />

          {/* Pass ID */}
          <View style={styles.passIdRow}>
            <Text style={styles.passIdLabel}>Pass ID: </Text>
            <Text style={styles.passId}>{passId}</Text>
          </View>
          
          <View style={styles.hintContainer}>
            <Ionicons name="alert-circle-outline" size={14} color={theme.colors.textMuted} />
            <Text style={styles.hint}>Show this pass at the gate</Text>
          </View>
        </Card>

        <Button onPress={handleShare} style={styles.shareBtn}>
          Share Pass
        </Button>
      </ScrollView>
    </View>
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
});

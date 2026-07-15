import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
} from "react-native";
import { theme } from "../../../constants";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { Badge } from "../../../components/ui/badge";
import { InfoRow } from "../../../components/ui/info-row";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";


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
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    alignSelf: "center",
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
  const passId = "VP12345678";

  const handleShare = async () => {
    await Share.share({
      message: `My Visitor Pass ID: ${passId}\nShow this at the gate.`,
    });
  };

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Visitor Pass" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badgeRow}>
          <Badge variant="success">
            Approved
          </Badge>
        </View>

        {/* Visitor info */}
        <View style={styles.visitorBlock}>
          <Text style={styles.visitorName}>Rahul Sharma</Text>
          <Text style={styles.visitorType}>Delivery Partner</Text>
        </View>

        {/* Date / time */}
        <Card variant="flat" style={styles.infoCard}>
          <InfoRow
            icon="calendar-outline"
            value="Today, 15 May 2024"
          />
          <View style={styles.divider} />
          <InfoRow
            icon="time-outline"
            value="10:00 AM – 11:00 AM"
          />
        </Card>

        {/* QR code */}
        <QRPlaceholder value={passId} />

        {/* Pass ID */}
        <View style={styles.passIdRow}>
          <Text style={styles.passIdLabel}>Pass ID: </Text>
          <Text style={styles.passId}>{passId}</Text>
        </View>
        <Text style={styles.hint}>⓪ Show this pass at the gate</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleShare} style={styles.shareBtn}>
          Share Pass
        </Button>
      </View>
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
    paddingBottom: theme.spacing.xxxl,
    alignItems: "center",
    gap: theme.spacing.xl,
  },
  badgeRow: {
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  visitorBlock: {
    alignItems: "center",
  },
  visitorName: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 4,
  },
  visitorType: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    width: "100%",
    gap: 0,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  passIdRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passIdLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  passId: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: -theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  shareBtn: {
    height: 52,
  },
});

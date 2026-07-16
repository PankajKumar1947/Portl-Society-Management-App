import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { InfoRow } from "@/components/ui/info-row";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

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
  const [note, setNote] = useState("");

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Approval Request" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Visitor identity */}
        <Card variant="flat" style={styles.visitorCard}>
          <View style={styles.visitorRow}>
            <Avatar name="Amit Kumar" size="lg" />
            <View style={styles.visitorInfo}>
              <Text style={styles.visitorName}>Amit Kumar</Text>
              <Text style={styles.visitorRole}>Guest</Text>
            </View>
          </View>
        </Card>

        {/* Details */}
        <Card variant="flat" style={styles.detailCard}>
          <InfoRow icon="home-outline" label="Flat" value="A-1203" />
          <View style={styles.divider} />
          <InfoRow icon="document-text-outline" label="Purpose" value="Personal Visit" />
          <View style={styles.divider} />
          <InfoRow icon="time-outline" value="Today, 04:00 PM – 06:00 PM" />
        </Card>

        {/* Countdown */}
        <CountdownTimer seconds={120} />

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            style={{ flex: 1, height: 50, borderColor: theme.colors.danger }}
            onPress={() => { }}
          >
            Decline
          </Button>
          <Button
            style={{ flex: 1, height: 50 }}
            onPress={() => {
              router.replace(Routes.Visitors.Pass("1"));
            }}
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

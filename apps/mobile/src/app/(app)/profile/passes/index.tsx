import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { useGetMyResident, useGetFamilyMembers } from "@repo/operations";

export default function PassesScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const { data: resident, isLoading: isResidentLoading } = useGetMyResident();
  const { data: familyMembers = [], isLoading: isFamilyLoading } = useGetFamilyMembers();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (isResidentLoading || isFamilyLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="My Passes" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Get current active pass details
  const activePass =
    selectedMemberId === null || !resident
      ? {
        name: resident ? `${resident.userDetails?.firstName} ${resident.userDetails?.lastName}`.trim() : "Resident",
        type: "Resident",
        passCode: resident?.passCode || "",
        subtext: resident?.tower && resident?.flat ? `${resident.tower.towerName} • Flat ${resident.flat.flatNumber}` : "",
      }
      : (() => {
        const fm = familyMembers.find((m) => m.familyMemberId === selectedMemberId);
        return {
          name: fm ? `${fm.firstName} ${fm.lastName}`.trim() : "Family Member",
          type: fm?.relationship ? `Family: ${fm.relationship}` : "Family Member",
          passCode: fm?.passCode || "",
          subtext: resident?.tower && resident?.flat ? `${resident.tower.towerName} • Flat ${resident.flat.flatNumber}` : "",
        };
      })();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Passes" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selector tab for choosing whose pass to show */}
        <Text style={styles.sectionTitle}>Select Member</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContainer}
        >
          <TouchableOpacity
            style={[
              styles.selectorItem,
              selectedMemberId === null && styles.selectorItemActive,
            ]}
            onPress={() => setSelectedMemberId(null)}
          >
            <Ionicons
              name="person-circle-outline"
              size={18}
              color={selectedMemberId === null ? theme.colors.surface : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.selectorText,
                selectedMemberId === null && styles.selectorTextActive,
              ]}
            >
              Me
            </Text>
          </TouchableOpacity>

          {familyMembers.map((member) => (
            <TouchableOpacity
              key={member.familyMemberId}
              style={[
                styles.selectorItem,
                selectedMemberId === member.familyMemberId && styles.selectorItemActive,
              ]}
              onPress={() => setSelectedMemberId(member.familyMemberId)}
            >
              <Ionicons
                name="people-outline"
                size={18}
                color={
                  selectedMemberId === member.familyMemberId
                    ? theme.colors.surface
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.selectorText,
                  selectedMemberId === member.familyMemberId && styles.selectorTextActive,
                ]}
              >
                {member.firstName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pass Card Container */}
        <View style={styles.passCard}>
          {/* Top segment */}
          <View style={styles.passHeader}>
            <View>
              <Text style={styles.passTitle}>{activePass.name}</Text>
              <Text style={styles.passType}>{activePass.type}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active Pass</Text>
            </View>
          </View>

          {/* Dotted separator line */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLeftCircle} />
            <View style={styles.dividerLine} />
            <View style={styles.dividerRightCircle} />
          </View>

          {/* Bottom segment with QR Code */}
          <View style={styles.passBody}>
            {activePass.passCode ? (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={activePass.passCode}
                  size={180}
                  backgroundColor={theme.colors.surface}
                  color={theme.colors.text}
                />
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.placeholderText}>Passcode not available</Text>
              </View>
            )}

            <Text style={styles.subtext}>{activePass.subtext}</Text>

            <View style={styles.warningBox}>
              <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.warningText}>
                Show this QR Code at the gate for secure entry and exit.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectorContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
  },
  selectorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    gap: theme.spacing.xs,
  },
  selectorItemActive: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  selectorTextActive: {
    color: theme.colors.surface,
  },
  passCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    borderWidth: 1,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  passHeader: {
    padding: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  passTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  passType: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs / 2,
  },
  badge: {
    backgroundColor: theme.colors.success + "15",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  badgeText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    overflow: "hidden",
  },
  dividerLeftCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    marginLeft: -10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dividerRightCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    marginRight: -10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  passBody: {
    padding: theme.spacing.lg,
    alignItems: "center",
    paddingTop: theme.spacing.sm,
  },
  qrWrapper: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  passCodeText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  subtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    gap: theme.spacing.xs,
    width: "100%",
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
});

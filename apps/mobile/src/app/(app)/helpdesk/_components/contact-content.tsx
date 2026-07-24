import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Society } from "@repo/schema";

interface ContactContentProps {
  society: Society | undefined;
}

export default function ContactContent({ society }: ContactContentProps) {
  if (!society) return null;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Support Team */}
      <Text style={styles.sectionTitle}>Support Team</Text>
      <View style={styles.section}>
        {society.supportCall && (
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL(`tel:${society.supportCall}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: "#E8F9EE" }]}>
              <Ionicons name="call-outline" size={22} color={theme.colors.success} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Call Support</Text>
              <Text style={styles.rowValue}>{society.supportCall}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
        {society.supportMail && (
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL(`mailto:${society.supportMail}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: "#EAF4FF" }]}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.info} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Email Support</Text>
              <Text style={styles.rowValue}>{society.supportMail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
        {!society.supportCall && !society.supportMail && (
          <Text style={styles.emptyText}>No support contact details available.</Text>
        )}
      </View>

      {/* Primary Contact */}
      <Text style={styles.sectionTitle}>Primary Contact</Text>
      <View style={styles.section}>
        {society.primaryContactName && (
          <View style={styles.row}>
            <View style={[styles.iconWrap, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="person-outline" size={22} color="#9333EA" />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Name</Text>
              <Text style={styles.rowValue}>{society.primaryContactName}</Text>
            </View>
          </View>
        )}
        {society.primaryContactNumber && (
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL(`tel:${society.primaryContactNumber}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="call-outline" size={22} color="#DC2626" />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Phone</Text>
              <Text style={styles.rowValue}>{society.primaryContactNumber}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
        {society.primaryContactEmail && (
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL(`mailto:${society.primaryContactEmail}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: "#EAF4FF" }]}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.info} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{society.primaryContactEmail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Address */}
      <Text style={styles.sectionTitle}>Address</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="location-outline" size={22} color="#D97706" />
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>Society Address</Text>
            <Text style={styles.rowValue}>
              {[society.addressLine, society.city, society.state, society.pincode]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
        </View>
      </View>

      {/* Website */}
      {society.website && (
        <>
          <Text style={styles.sectionTitle}>Online</Text>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL(society.website!)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, { backgroundColor: "#E8F9EE" }]}>
                <Ionicons name="globe-outline" size={22} color={theme.colors.success} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Website</Text>
                <Text style={styles.rowValue} numberOfLines={1}>{society.website}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.section,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 1,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    paddingVertical: theme.spacing.lg,
  },
});

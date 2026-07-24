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
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Get in touch with your society's support team</Text>

      {society?.supportCall && (
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL(`tel:${society.supportCall}`)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: "#E8F9EE" }]}>
            <Ionicons name="call-outline" size={28} color={theme.colors.success} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Call Support</Text>
            <Text style={styles.contactValue}>{society.supportCall}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      )}

      {society?.supportMail && (
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL(`mailto:${society.supportMail}`)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: "#EAF4FF" }]}>
            <Ionicons name="mail-outline" size={28} color={theme.colors.info} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email Support</Text>
            <Text style={styles.contactValue}>{society.supportMail}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      )}

      {!society?.supportCall && !society?.supportMail && (
        <View style={styles.noContact}>
          <Ionicons name="information-circle-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.noContactTitle}>No contact info available</Text>
          <Text style={styles.noContactSubtitle}>
            Your society hasn't set up support contact details yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
  },
  heading: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  noContact: {
    alignItems: "center",
    paddingVertical: 48,
    gap: theme.spacing.sm,
  },
  noContactTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  noContactSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});

import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";

type SupportRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isLast?: boolean;
};

const SupportRow: React.FC<SupportRowProps> = ({ icon, iconColor, title, subtitle, onPress, isLast }) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.rowBorder]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={[styles.rowIcon, { backgroundColor: (iconColor ?? theme.colors.primary) + "18" }]}>
      <Ionicons name={icon} size={20} color={iconColor ?? theme.colors.primary} />
    </View>
    <View style={styles.rowText}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    {onPress ? <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} /> : null}
  </TouchableOpacity>
);

export default function SupportScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Support" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subheading}>
          Choose the right support channel based on your issue type.
        </Text>

        {/* Society-related issues */}
        <View style={styles.sectionHeader}>
          <Ionicons name="business-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Society-related issues</Text>
        </View>
        <Text style={styles.sectionDescription}>
          For issues with maintenance, amenities, complaints, or anything related to your society — raise a helpdesk ticket and your society management will respond.
        </Text>
        <View style={styles.card}>
          <SupportRow
            icon="ticket-outline"
            iconColor={theme.colors.primary}
            title="Raise a Helpdesk Ticket"
            subtitle="Maintenance, amenities, complaints & more"
            onPress={() => router.push("/(app)/helpdesk/create")}
          />
          <SupportRow
            icon="list-outline"
            iconColor={theme.colors.primary}
            title="My Tickets"
            subtitle="Track your open and resolved requests"
            onPress={() => router.push("/(app)/helpdesk")}
            isLast
          />
        </View>

        {/* App-related issues */}
        <View style={[styles.sectionHeader, { marginTop: theme.spacing.xl }]}>
          <Ionicons name="phone-portrait-outline" size={16} color={theme.colors.info} />
          <Text style={[styles.sectionTitle, { color: theme.colors.info }]}>App-related issues</Text>
        </View>
        <Text style={styles.sectionDescription}>
          For issues with the Portl app itself — bugs, account problems, or general feedback — reach out to our support team directly.
        </Text>
        <View style={styles.card}>
          <SupportRow
            icon="bug-outline"
            iconColor={theme.colors.info}
            title="Report a Bug"
            subtitle="Found a bug or something not working?"
            onPress={() => { }}
          />
          <SupportRow
            icon="chatbubbles-outline"
            iconColor={theme.colors.info}
            title="Chat with Support"
            subtitle="We'll get back to you as soon as possible"
            onPress={() => { }}
          />
          <SupportRow
            icon="call-outline"
            iconColor={theme.colors.info}
            title="Call Us"
            subtitle="1800 123 4567 · Mon–Sat, 10 AM – 6 PM"
            isLast
          />
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
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  heading: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  subheading: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  rowSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

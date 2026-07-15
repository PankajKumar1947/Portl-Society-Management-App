import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import Card from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import IconButton from "../../components/ui/icon-button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const GRID_ITEM_WIDTH = (width - theme.spacing.lg * 2 - theme.spacing.md * 2) / 3;

interface GridItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

export default function ResidentDashboard() {
  const router = useRouter();

  const servicesGrid: GridItem[] = [
    { id: "visitors", title: "Visitors", icon: "people-outline", route: "/(resident)/visitors" },
    { id: "amenities", title: "Amenities", icon: "business-outline", route: "/(resident)/bookings" },
    { id: "notices", title: "Notices", icon: "document-text-outline", route: "/(resident)/helpdesk" },
    { id: "helpdesk", title: "Helpdesk", icon: "construct-outline", route: "/(resident)/helpdesk" },
    { id: "polls", title: "Polls", icon: "checkbox-outline", route: "/(resident)/helpdesk" },
    { id: "payments", title: "Payments", icon: "wallet-outline", route: "/(resident)/bookings" },
  ];

  const quickActions: QuickAction[] = [
    { id: "invite", title: "Invite Guest", icon: "person-add-outline", route: "/(resident)/visitors" },
    { id: "pre_approve", title: "Pre-Approve", icon: "checkmark-circle-outline", route: "/(resident)/visitors" },
    { id: "bookings", title: "My Bookings", icon: "calendar-outline", route: "/(resident)/bookings" },
    { id: "pass", title: "View Pass", icon: "qr-code-outline", route: "/(resident)/visitors" },
  ];

  const handleGridPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.nameText}>Sunita 👋</Text>
            <Text style={styles.subText}>Tower A - 402</Text>
          </View>
          <IconButton
            onPress={() => console.log("Notifications pressed")}
            icon={<Ionicons name="notifications-outline" size={24} color={theme.colors.text} />}
            variant="ghost"
            style={styles.bellButton}
          />
        </View>

        {/* Dashboard Grid Services Section */}
        <View style={styles.gridContainer}>
          {servicesGrid.map((item) => (
            <Card
              key={item.id}
              variant="flat"
              onPress={() => handleGridPress(item.route)}
              style={styles.gridCard}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={28} color={theme.colors.primaryDark} />
              </View>
              <Text style={styles.gridCardTitle}>{item.title}</Text>
            </Card>
          ))}
        </View>

        {/* Quick Actions Row */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          {quickActions.map((action) => (
            <Card
              key={action.id}
              variant="flat"
              onPress={() => handleGridPress(action.route)}
              style={styles.quickActionCard}
            >
              <View style={styles.quickActionIconWrapper}>
                <Ionicons name={action.icon} size={22} color={theme.colors.primaryDark} />
              </View>
              <Text style={styles.quickActionCardTitle} numberOfLines={1}>
                {action.title}
              </Text>
            </Card>
          ))}
        </ScrollView>

        {/* Upcoming Visits Section */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
        </View>
        <Card variant="flat" style={styles.upcomingCard}>
          <View style={styles.upcomingContent}>
            {/* Avatar Placeholder */}
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={28} color={theme.colors.textSecondary} />
            </View>

            <View style={styles.upcomingInfo}>
              <Text style={styles.visitorName}>Rahul Sharma</Text>
              <Text style={styles.visitorSubText}>Delivery Partner</Text>
              <Text style={styles.visitorTimeText}>Today, 10:00 AM</Text>
            </View>

            <Badge variant="success" style={styles.approvedBadge}>
              Approved
            </Badge>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    // 72px (tab bar) + 24px (bottom offset) + 16px extra breathing room
    paddingBottom: 112,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  greetingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
    lineHeight: 32,
  },
  subText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  bellButton: {
    backgroundColor: theme.colors.surfaceSecondary,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  gridCard: {
    width: GRID_ITEM_WIDTH,
    height: 105,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
    borderRadius: theme.radius.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  gridCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  sectionHeaderContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  quickActionCard: {
    width: 100,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
    borderRadius: theme.radius.lg,
  },
  quickActionIconWrapper: {
    marginBottom: theme.spacing.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    width: "100%",
  },
  upcomingCard: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  upcomingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  upcomingInfo: {
    flex: 1,
    justifyContent: "center",
  },
  visitorName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  visitorSubText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  visitorTimeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  approvedBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
});

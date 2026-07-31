import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import Card from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import IconButton from "../../components/ui/icon-button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routes } from "@/constants";
import { Images } from "@/assets/images";
import { useAccessControl, useGetMyResident, useGetNotices } from "@repo/operations";
import { AclResource, type AclResourceName } from "@repo/schema";
import { useAuth } from "@/context/auth-context";
import { formatNoticeDate } from "@/utils/notice";

interface GridItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: () => void;
  resource: AclResourceName;
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: () => void;
}

export default function HomeScreen() {
  const router = useRouter();
  const { canViewModule, isResident } = useAccessControl();
  const { user } = useAuth();
  const { data: resident } = useGetMyResident({ enabled: isResident });
  const { data: notices, isLoading: isNoticesLoading } = useGetNotices({ status: "published" });
  const recentNotices = notices?.slice(0, 2) || [];
  const { width } = useWindowDimensions();
  const numColumns = 3;
  const totalGap = theme.spacing.lg * 2 + theme.spacing.md * (numColumns - 1);
  const gridItemWidth = Math.floor((width - totalGap) / numColumns) - 1;

  const servicesGrid: GridItem[] = [
    { id: "society", title: "My Society", icon: "business-outline", route: () => router.push(Routes.Society.Index), resource: AclResource.SOCIETY },
    { id: "towers", title: "Towers", icon: "cube-outline", route: () => router.push(Routes.Towers.Index), resource: AclResource.TOWERS },
    { id: "residents", title: "Residents", icon: "people-circle-outline", route: () => router.push(Routes.Residents.Index as any), resource: AclResource.RESIDENTS },
    { id: "guards", title: "Security Guards", icon: "shield-half-outline", route: () => router.push(Routes.Guards.Index as any), resource: AclResource.GUARDS },
    { id: "visitors", title: "Visitors", icon: "people-outline", route: () => router.push(Routes.Visitors.Index), resource: AclResource.VISITORS },
    { id: "amenities", title: "Amenities", icon: "home-outline", route: () => router.push(Routes.Amenities.Index), resource: AclResource.AMENITIES },
    { id: "notices", title: "Notices", icon: "document-text-outline", route: () => router.push(Routes.Notices.Index), resource: AclResource.NOTICES },
    { id: "community", title: "Community", icon: "people-circle-outline", route: () => router.push(Routes.Community.Index), resource: AclResource.COMMUNITY },
    { id: "helpdesk", title: "Helpdesk", icon: "help-buoy-outline", route: () => router.push(Routes.Helpdesk.Index), resource: AclResource.HELPDESK_TICKETS },
    { id: "complaints", title: "Complaints", icon: "alert-circle-outline", route: () => router.push(Routes.Complaints.Index), resource: AclResource.COMPLAINTS },
    { id: "polls", title: "Polls", icon: "stats-chart-outline", route: () => router.push(Routes.Polls.Index), resource: AclResource.POLLS },
  ].filter((item) => canViewModule(item.resource)) as GridItem[];

  const quickActions: QuickAction[] = [
    ...(isResident ? [
      { id: "invite", title: "Invite Guest", icon: "person-add-outline", route: () => router.push(Routes.Visitors.Create) },
      { id: "pass", title: "View Passes", icon: "eye-outline", route: () => router.push("/profile/passes") },
    ] : [
      { id: "scan", title: "Scan Pass", icon: "qr-code-outline", route: () => router.push(Routes.Visitors.Scan) },
    ]),
    { id: "bookings", title: "My Bookings", icon: "calendar-outline", route: () => router.push(Routes.Amenities.Bookings.Index) },
  ].filter((a) => {
    if (a.id === "bookings") return canViewModule(AclResource.AMENITIES);
    return canViewModule(AclResource.VISITORS);
  }) as QuickAction[];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={Images.logoText}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.headerActions}>
            <IconButton
              onPress={() => router.push(Routes.Notifications)}
              icon={<Ionicons name="notifications-outline" size={22} color={theme.colors.text} />}
              variant="ghost"
              style={styles.headerActionButton}
            />
            <IconButton
              onPress={() => router.push(Routes.Profile.Index)}
              icon={<Ionicons name="person-outline" size={22} color={theme.colors.text} />}
              variant="ghost"
              style={styles.headerActionButton}
            />
          </View>
        </View>

        {/* Welcome Greeting Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greetingText}>Good Morning,</Text>
          <Text style={styles.nameText}>{user ? `${user.firstName} ${user.lastName}`.trim() : "Resident"} 👋</Text>
          {isResident && resident && (
            <View style={styles.allotmentContainer}>
              <Ionicons name="business" size={16} color={theme.colors.textSecondary} style={styles.allotmentIcon} />
              <Text style={styles.allotmentText}>
                {resident.tower?.towerName || "Tower"} • Flat {resident.flat?.flatNumber || "Flat"}
              </Text>
            </View>
          )}
        </View>


        {/* Dashboard Grid Services Section */}
        <View style={styles.gridContainer}>
          {servicesGrid.map((item) => (
            <Card
              key={item.id}
              variant="flat"
              onPress={item.route}
              style={[styles.gridCard, { width: gridItemWidth }]}
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
              onPress={action.route}
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

        {/* Recent Notices Section */}
        <View style={styles.noticesHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Notices</Text>
          <TouchableOpacity onPress={() => router.push(Routes.Notices.Index)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {isNoticesLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loader} />
        ) : recentNotices.length > 0 ? (
          recentNotices.map((notice) => (
            <Card
              key={notice.noticeId}
              variant="flat"
              style={styles.noticeCard}
              onPress={() => router.push(Routes.Notices.Details(notice.noticeId))}
            >
              <View style={styles.noticeHeader}>
                <Text style={styles.noticeCardTitle} numberOfLines={1}>
                  {notice.title}
                </Text>
                <Text style={styles.noticeDate}>
                  {formatNoticeDate(notice.publishedOn || notice.createdAt)}
                </Text>
              </View>
              <Text style={styles.noticeDesc} numberOfLines={2}>
                {notice.description}
              </Text>
            </Card>
          ))
        ) : (
          <Card variant="flat" style={styles.emptyNoticeCard}>
            <Text style={styles.emptyNoticeText}>No recent notices from administration.</Text>
          </Card>
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logoImage: {
    width: 130,
    height: 40,
  },
  welcomeSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  greetingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  nameText: {
    fontSize: 26,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    lineHeight: 32,
    marginTop: 2,
  },
  allotmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  allotmentIcon: {
    marginRight: 6,
  },
  allotmentText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  headerActionButton: {
    backgroundColor: theme.colors.surfaceSecondary,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  gridCard: {
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
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: "center",
  },
  sectionHeaderContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
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
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    textAlign: "center",
    width: "100%",
  },
  noticesHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeights.semibold,
  },
  noticeCard: {
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  noticeCardTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  noticeDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  noticeDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  emptyNoticeCard: {
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
    borderRadius: theme.radius.lg,
  },
  emptyNoticeText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  loader: {
    marginVertical: theme.spacing.lg,
  },
});

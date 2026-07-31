import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Fab } from "@/components/ui/fab";
import { EmptyState } from "@/components/layout/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Routes } from "@/constants/routes";
import { useGetVisitors, useAccessControl, useGetTowers } from "@repo/operations";
import { AclResource, VISITOR_STATUS } from "@repo/schema";
import { VisitorCard } from "./_components/visitor-card";

const TABS = [
  { id: "all", label: "All" },
  { id: VISITOR_STATUS.PENDING, label: "Pending" },
  { id: VISITOR_STATUS.APPROVED, label: "Approved" },
];

export default function VisitorsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<"visitors" | "residents">("visitors");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const statusFilter =
    category === "visitors" && activeTab !== "all" ? activeTab : undefined;
  const { data: visitors = [], isLoading, refetch } = useGetVisitors({
    status: statusFilter,
    type: category === "residents" ? "residents" : undefined,
  });

  const { canViewModule } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const shouldFetchTowers = canViewTower || canViewFlat;
  const { data: towers = [] } = useGetTowers({ enabled: shouldFetchTowers });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Visitors"
        showBack={true}
        rightElement={
          <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
            <IconButton
              onPress={() => router.push(Routes.Visitors.Scan)}
              icon={<Ionicons name="qr-code-outline" size={22} color={theme.colors.text} />}
              variant="ghost"
            />
            <IconButton
              onPress={() => router.push(Routes.Visitors.Logs)}
              icon={<Ionicons name="document-text-outline" size={22} color={theme.colors.text} />}
              variant="ghost"
            />
          </View>
        }
      />

      <View style={styles.container}>
        <View style={styles.tabRow}>
          <View style={[styles.segmentContainer, { flex: 1 }]}>
            <TouchableOpacity
              style={[styles.segmentButton, category === "visitors" && styles.segmentButtonActive]}
              onPress={() => setCategory("visitors")}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, category === "visitors" && styles.segmentTextActive]}>
                Visitors
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentButton, category === "residents" && styles.segmentButtonActive]}
              onPress={() => setCategory("residents")}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, category === "residents" && styles.segmentTextActive]}>
                Residents & Family
              </Text>
            </TouchableOpacity>
          </View>

          {category === "visitors" && (
            <TouchableOpacity
              onPress={() => setShowFilters((v) => !v)}
              style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="options-outline"
                size={20}
                color={showFilters ? "#fff" : theme.colors.text}
              />
            </TouchableOpacity>
          )}
        </View>

        {showFilters && category === "visitors" && (
          <FilterTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            style={styles.filterTabs}
          />
        )}

        <FlatList
          data={visitors}
          keyExtractor={(item) => item.logId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <EmptyState
              icon={category === "residents" ? "card-outline" : "people-outline"}
              title={category === "residents" ? "No resident scans yet" : "No visitors yet"}
              description={category === "residents" ? "No resident or family entries have been logged yet." : "Invite a guest or pre-approve a delivery to see them here."}
            />
          }
          renderItem={({ item }) => (
            <VisitorCard
              item={item}
              isResidentCategory={category === "residents"}
              onPress={() => router.push(Routes.Visitors.Pass(item.logId))}
              shouldFetchTowers={shouldFetchTowers}
              canViewTower={canViewTower}
              canViewFlat={canViewFlat}
              towerMap={towerMap}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <Fab
        icon="person-add-outline"
        label="Add Visitor"
        onPress={() => router.push(Routes.Visitors.Create)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.sm,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 46,
    alignItems: "center",
  },
  segmentButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.full,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  segmentTextActive: {
    color: theme.colors.text,
  },
  filterTabs: {
    marginBottom: theme.spacing.sm,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 180,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 0,
    overflow: "hidden",
  },
  separator: {
    height: theme.spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  locationSep: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginHorizontal: 2,
  },
});

import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Card } from "@/components/ui/card";
import { PersonListItem } from "@/components/ui/person-list-item";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/layout/empty-state";
import { useGetVisitors, useAccessControl, useGetTowers } from "@repo/operations";
import { AclResource } from "@repo/schema";
import { Routes } from "@/constants/routes";

type HistoryType = "all" | "guest" | "delivery" | "service_staff";
type VisitorStatus = "approved" | "rejected" | "completed";

const STATUS_VARIANT: Record<VisitorStatus, "success" | "danger" | "secondary"> = {
  approved: "success",
  rejected: "danger",
  completed: "secondary",
};

const STATUS_LABEL: Record<VisitorStatus, string> = {
  approved: "Active",
  rejected: "Rejected",
  completed: "Completed",
};

const TABS = [
  { id: "all", label: "All" },
  { id: "guest", label: "Guests" },
  { id: "delivery", label: "Delivery" },
  { id: "service_staff", label: "Staff" },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HistoryType>("all");

  const typeFilter = activeTab === "all" ? undefined : activeTab;
  const { data: visitors = [], isLoading, refetch } = useGetVisitors({ status: "completed,rejected", type: typeFilter });

  const { canViewModule } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const shouldFetchTowers = canViewTower || canViewFlat;
  const { data: towers = [] } = useGetTowers({ enabled: shouldFetchTowers });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Visitor History" />

      <FilterTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as HistoryType)}
        style={styles.filterTabs}
      />

      <FlatList
        data={visitors}
        keyExtractor={(item) => item.visitorId}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No history found"
            description="Your past visitor records will appear here."
          />
        }
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.card}
            onPress={() => router.push(Routes.Visitors.Pass(item.visitorId))}
          >
            <PersonListItem
              name={item.name}
              subtitle={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              meta={item.visitedAt ? new Date(item.visitedAt).toLocaleString() : "Date unavailable"}
              rightElement={
                <Badge variant={STATUS_VARIANT[item.status as VisitorStatus]}>
                  {STATUS_LABEL[item.status as VisitorStatus]}
                </Badge>
              }
            />
            {shouldFetchTowers && item.flat && (
              <View style={styles.locationRow}>
                {canViewTower && towerMap.get(item.flat.towerId) && (
                  <Text style={styles.locationText}>{towerMap.get(item.flat.towerId)}</Text>
                )}
                {canViewTower && canViewFlat && <Text style={styles.locationSep}>•</Text>}
                {canViewFlat && (
                  <Text style={styles.locationText}>{item.flat.flatNumber}</Text>
                )}
              </View>
            )}
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterTabs: {
    marginBottom: theme.spacing.sm,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
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

import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Card } from "@/components/ui/card";
import { PersonListItem } from "@/components/ui/person-list-item";
import { Badge } from "@/components/ui/badge";
import { Fab } from "@/components/ui/fab";
import { EmptyState } from "@/components/layout/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Routes } from "@/constants/routes";
import { useGetVisitors, useAccessControl, useGetTowers } from "@repo/operations";
import { AclResource, VISITOR_STATUS } from "@repo/schema";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "secondary"> = {
  [VISITOR_STATUS.APPROVED]: "success",
  [VISITOR_STATUS.PENDING]: "warning",
  [VISITOR_STATUS.REJECTED]: "danger",
  [VISITOR_STATUS.COMPLETED]: "secondary",
};

const TABS = [
  { id: "all", label: "All" },
  { id: VISITOR_STATUS.PENDING, label: "Pending" },
  { id: VISITOR_STATUS.APPROVED, label: "Approved" },
];

export default function VisitorsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const statusFilter = activeTab === VISITOR_STATUS.PENDING ? VISITOR_STATUS.PENDING : activeTab === VISITOR_STATUS.APPROVED ? VISITOR_STATUS.APPROVED : undefined;
  const { data: visitors = [], isLoading, refetch } = useGetVisitors({ status: statusFilter });

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
        showBack={false}
        leftElement={
          <IconButton
            onPress={() => router.push(Routes.Amenities.Index)}
            icon={<Ionicons name="calendar-outline" size={22} color={theme.colors.text} />}
            variant="ghost"
          />
        }
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
        <FilterTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.filterTabs}
        />

        <FlatList
          data={visitors}
          keyExtractor={(item) => item.logId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No visitors yet"
              description="Invite a guest or pre-approve a delivery to see them here."
            />
          }
          renderItem={({ item }) => (
            <Card
              variant="flat"
              style={styles.card}
              onPress={() => router.push(Routes.Visitors.Pass(item.logId))}
            >
              <PersonListItem
                name={item.name}
                subtitle={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                meta={item.purpose || "No purpose specified"}
                rightElement={
                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
      </View>
      <Fab
        icon="person-add-outline"
        label="Invite Visitor"
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
  filterTabs: {
    marginBottom: theme.spacing.sm,
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

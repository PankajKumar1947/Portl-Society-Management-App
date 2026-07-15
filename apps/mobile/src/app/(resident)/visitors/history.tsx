import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../../constants";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { FilterTabs } from "../../../components/ui/filter-tabs";
import { Card } from "../../../components/ui/card";
import { PersonListItem } from "../../../components/ui/person-list-item";
import { Badge } from "../../../components/ui/badge";
import { EmptyState } from "../../../components/ui/empty-state";


type HistoryType = "all" | "guest" | "delivery" | "staff";
type VisitorStatus = "approved" | "rejected" | "checked_out";

interface HistoryEntry {
  id: string;
  name: string;
  type: string;
  category: "guest" | "delivery" | "staff";
  date: string;
  status: VisitorStatus;
}

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "1", name: "Rahul Sharma", type: "Delivery Partner", category: "delivery", date: "16 May 2024, 10:30 AM", status: "approved" },
  { id: "2", name: "Amit Kumar", type: "Guest", category: "guest", date: "14 May 2024, 04:00 PM", status: "approved" },
  { id: "3", name: "Vikram Singh", type: "Service Staff", category: "staff", date: "13 May 2024, 11:00 AM", status: "approved" },
  { id: "4", name: "Rohit Patel", type: "Cab Driver", category: "guest", date: "12 May 2024, 08:30 AM", status: "checked_out" },
  { id: "5", name: "Priya Desai", type: "Guest", category: "guest", date: "11 May 2024, 12:00 PM", status: "rejected" },
];

const STATUS_VARIANT: Record<VisitorStatus, "success" | "danger" | "secondary"> = {
  approved: "success",
  rejected: "danger",
  checked_out: "secondary",
};

const STATUS_LABEL: Record<VisitorStatus, string> = {
  approved: "Approved",
  rejected: "Rejected",
  checked_out: "Checked Out",
};

const TABS = [
  { id: "all", label: "All" },
  { id: "guest", label: "Guests" },
  { id: "delivery", label: "Delivery" },
  { id: "staff", label: "Staff" },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HistoryType>("all");

  const filtered = activeTab === "all"
    ? MOCK_HISTORY
    : MOCK_HISTORY.filter((h) => h.category === activeTab);

  return (
    <View style={styles.safeArea}>
      <ScreenHeader title="Visitor History" />

      <FilterTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as HistoryType)}
        style={styles.filterTabs}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
            onPress={() => router.push("/(resident)/visitors/pass")}
          >
            <PersonListItem
              name={item.name}
              subtitle={item.type}
              meta={item.date}
              rightElement={
                <Badge variant={STATUS_VARIANT[item.status]}>
                  {STATUS_LABEL[item.status]}
                </Badge>
              }
            />
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
});

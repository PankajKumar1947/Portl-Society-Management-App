import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
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
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";

type VisitorStatus = "approved" | "pending" | "rejected";

interface Visitor {
  id: string;
  name: string;
  type: string;
  time: string;
  status: VisitorStatus;
  filter: "upcoming" | "approved" | "history";
}

const MOCK_VISITORS: Visitor[] = [
  { id: "1", name: "Rahul Sharma", type: "Delivery Partner", time: "Today, 10:30 AM", status: "approved", filter: "upcoming" },
  { id: "2", name: "Amit Kumar", type: "Guest", time: "Today, 04:00 PM", status: "pending", filter: "upcoming" },
  { id: "3", name: "Vikram Singh", type: "Service Staff", time: "Tomorrow, 11:00 AM", status: "approved", filter: "upcoming" },
  { id: "4", name: "Rohit Patel", type: "Cab Driver", time: "Tomorrow, 08:30 AM", status: "rejected", filter: "upcoming" },
  { id: "5", name: "Rahul Sharma", type: "Delivery Partner", time: "16 May 2024, 10:30 AM", status: "approved", filter: "approved" },
  { id: "6", name: "Amit Kumar", type: "Guest", time: "14 May 2024, 04:00 PM", status: "approved", filter: "approved" },
  { id: "7", name: "Vikram Singh", type: "Service Staff", time: "13 May 2024, 11:00 AM", status: "approved", filter: "history" },
  { id: "8", name: "Rohit Patel", type: "Cab Driver", time: "12 May 2024, 08:30 AM", status: "rejected", filter: "history" },
];

const STATUS_VARIANT: Record<VisitorStatus, "success" | "warning" | "danger"> = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "approved", label: "Approved" },
  { id: "history", label: "History" },
];

export default function VisitorsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  const filtered = MOCK_VISITORS.filter((v) => v.filter === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Visitors"
        showBack={false}
        leftElement={
          <IconButton
            onPress={() => router.push("/(resident)/amenities")}
            icon={<Ionicons name="calendar-outline" size={22} color={theme.colors.text} />}
            variant="ghost"
          />
        }
        rightElement={
          <IconButton
            onPress={() => { }}
            icon={<Ionicons name="search-outline" size={22} color={theme.colors.text} />}
            variant="ghost"
          />
        }
      />

      <View>
        <FilterTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.filterTabs}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
              onPress={() => router.push({
                pathname: "/(resident)/visitors/[id]/approval",
                params: { id: item.id }
              })}
            >
              <PersonListItem
                name={item.name}
                subtitle={item.type}
                meta={item.time}
                rightElement={
                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                }
              />
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />


      </View>
      <Fab
        icon="person-add-outline"
        label="Invite Visitor"
        onPress={() => router.push("/(resident)/visitors/create")}
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
});

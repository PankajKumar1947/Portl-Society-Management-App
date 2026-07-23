import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import IconButton from "@/components/ui/icon-button";
import FilterTabs from "@/components/ui/filter-tabs";
import PersonListItem from "@/components/ui/person-list-item";
import Badge from "@/components/ui/badge";

// Temporary Mock Data for UI verification
const MOCK_GUARDS = [
  {
    guardId: "grd_1",
    name: "David Chen",
    email: "david.chen@security.com",
    phoneNumber: "9876543210",
    shiftType: "DAY",
    gateNumber: "Gate 1",
    status: "ACTIVE",
    agencyName: "Swift Security",
  },
  {
    guardId: "grd_2",
    name: "Emma Wilson",
    email: "emma.wilson@security.com",
    phoneNumber: "9876543211",
    shiftType: "NIGHT",
    gateNumber: "Gate 3",
    status: "ACTIVE",
    agencyName: "Swift Security",
  },
  {
    guardId: "grd_3",
    name: "Michael Brown",
    email: "michael.brown@security.com",
    phoneNumber: "9876543212",
    shiftType: "DAY",
    gateNumber: "Gate 2",
    status: "INACTIVE",
    agencyName: "Guardian Force",
  },
];

export default function GuardsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const filterTabs = [
    { id: "ALL", label: "All Shifts" },
    { id: "DAY", label: "Day Shift" },
    { id: "NIGHT", label: "Night Shift" },
  ];

  // Client-side filtering of mockup data
  const filteredGuards = MOCK_GUARDS.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phoneNumber.includes(searchQuery) ||
      g.gateNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesShift = activeTab === "ALL" || g.shiftType === activeTab;

    return matchesSearch && matchesShift;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Security Guards"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Guards.Create as any)}
            icon={<Ionicons name="add" size={22} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      {/* Search Input Container */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name, gate, or phone..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <FilterTabs
        tabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.tabs}
      />

      <FlatList
        data={filteredGuards}
        keyExtractor={(item) => item.guardId}
        renderItem={({ item }) => (
          <View style={styles.listItemWrapper}>
            <PersonListItem
              name={item.name}
              subtitle={`${item.shiftType === "DAY" ? "Day Shift" : "Night Shift"} • ${item.gateNumber}`}
              meta={`Phone: ${item.phoneNumber} • ${item.agencyName}`}
              onPress={() => router.push(Routes.Guards.Details(item.guardId) as any)}
              rightElement={
                <View style={styles.rightContainer}>
                  <Badge variant={item.status === "ACTIVE" ? "success" : "danger"}>
                    {item.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                  <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} style={styles.chevron} />
                </View>
              }
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="shield-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No guards found matching criteria</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    height: "100%",
  },
  tabs: {
    marginBottom: theme.spacing.xs,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },
  listItemWrapper: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginVertical: theme.spacing.xs,
    overflow: "hidden",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  chevron: {
    marginLeft: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
});

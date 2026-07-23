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
import { useGetGuards } from "@repo/operations";
import LoadingScreen from "@/components/layout/loading-screen";
import { EmptyState } from "@/components/layout/empty-state";

export default function GuardsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const { data: guards, isLoading } = useGetGuards({
    type: activeTab,
    search: searchQuery,
  });

  const filterTabs = [
    { id: "ALL", label: "All Shifts" },
    { id: "DAY", label: "Day Shift" },
    { id: "NIGHT", label: "Night Shift" },
  ];

  const filteredGuards = guards || [];
  if (isLoading) {
    return <LoadingScreen title="Security Guards" onBack={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Security Guards"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Guards.Create)}
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
        renderItem={({ item }) => {
          const userDetails = item.userDetails;
          return (
            <View style={styles.listItemWrapper}>
              <PersonListItem
                name={`${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`}
                subtitle={`${item.shiftType === "DAY" ? "Day Shift" : "Night Shift"} • ${item.gateNumber}`}
                meta={`Phone: ${userDetails?.phoneNumber || ""} • ${item.agencyName || ""}`}
                onPress={() => router.push(Routes.Guards.Details(item.guardId))}
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
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState icon="shield-outline" title="No guards found matching criteria" />
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
});

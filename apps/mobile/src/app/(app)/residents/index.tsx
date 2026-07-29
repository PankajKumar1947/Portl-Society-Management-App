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
import LoadingScreen from "@/components/layout/loading-screen";
import { useGetResidents, useAccessControl } from "@repo/operations";
import { AclResource } from "@repo/schema";
import { EmptyState } from "@/components/layout/empty-state";

export default function ResidentsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const { canCreate } = useAccessControl(AclResource.RESIDENTS);

  const { data: residents, isLoading, refetch } = useGetResidents(
    undefined,
    { type: activeTab, search: searchQuery }
  );

  const filterTabs = [
    { id: "ALL", label: "All" },
    { id: "OWNER", label: "Owners" },
    { id: "TENANT", label: "Tenants" },
    { id: "FAMILY_MEMBER", label: "Family" },
  ];

  const filteredResidents = residents || [];

  if (isLoading && !filteredResidents.length) return <LoadingScreen title="Residents" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Residents Directory"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          canCreate && (
            <IconButton
              onPress={() => router.push(Routes.Residents.Create as any)}
              icon={<Ionicons name="add" size={22} color={theme.colors.text} />}
              variant="ghost"
              size="md"
            />
          )
        }
      />

      {/* Search Input Container */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name, flat, or phone..."
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
          data={filteredResidents}
          keyExtractor={(item) => item.residentId}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <View style={styles.listItemWrapper}>
              <PersonListItem
                name={`${item.userDetails?.firstName || ""} ${item.userDetails?.lastName || ""}`}
                subtitle={`Flat ${item.flatNumber} • ${item.towerId.toUpperCase().replace("-", " ")}`}
                meta={`Mobile: ${item.userDetails?.phoneNumber || ""}`}
                onPress={() => router.push(Routes.Residents.Details(item.residentId) as any)}
                rightElement={
                  <View style={styles.rightContainer}>
                    <Badge variant={item.residentType === "OWNER" ? "success" : item.residentType === "TENANT" ? "info" : "warning"}>
                      {item.residentType === "FAMILY_MEMBER" ? "Family" : item.residentType.toLowerCase()}
                    </Badge>
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} style={styles.chevron} />
                  </View>
                }
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="people-outline" title="No residents found matching criteria" />
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

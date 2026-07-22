import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import IconButton from "@/components/ui/icon-button";
import FilterTabs from "@/components/ui/filter-tabs";
import PersonListItem from "@/components/ui/person-list-item";
import Badge from "@/components/ui/badge";
import { mockResidents, Resident } from "./_components/mock-data";

export default function ResidentsListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [residents, setResidents] = useState<Resident[]>(mockResidents);

  // Re-fetch/sync residents whenever screen focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setResidents([...mockResidents]);
    });
    return unsubscribe;
  }, [navigation]);

  const filterTabs = [
    { id: "ALL", label: "All" },
    { id: "OWNER", label: "Owners" },
    { id: "TENANT", label: "Tenants" },
    { id: "FAMILY_MEMBER", label: "Family" },
  ];

  const filteredResidents = residents.filter((res) => {
    // Filter by tab
    if (activeTab !== "ALL" && res.residentType !== activeTab) {
      return false;
    }
    // Filter by search query
    const fullName = `${res.firstName} ${res.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      res.flatNumber.toLowerCase().includes(query) ||
      res.mobileNumber.includes(query) ||
      res.towerId.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Residents Directory"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Residents.Create as any)}
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

      {/* Residents List */}
      <FlatList
        data={filteredResidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItemWrapper}>
            <PersonListItem
              name={`${item.firstName} ${item.lastName}`}
              subtitle={`Flat ${item.flatNumber} • ${item.towerId.toUpperCase().replace("-", " ")}`}
              meta={`Mobile: ${item.mobileNumber}`}
              onPress={() => router.push(Routes.Residents.Details(item.id) as any)}
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
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No residents found matching criteria</Text>
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

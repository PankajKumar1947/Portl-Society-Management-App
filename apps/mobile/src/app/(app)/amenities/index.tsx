import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Modal } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useGetAmenities, useGetMe, useGetTowers } from "@repo/operations";
import { AmenityData, AMENITY_CATEGORIES, AMENITY_TYPES, AMENITY_STATUSES } from "@repo/schema";
import LoadingScreen from "@/components/layout/loading-screen";
import { EmptyState } from "@/components/layout/empty-state";

const CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  ...AMENITY_CATEGORIES.map((c) => ({ label: c.replace(/_/g, " "), value: c })),
];

const TYPE_OPTIONS = [
  { label: "All", value: "all" },
  ...AMENITY_TYPES.map((t) => ({ label: t, value: t })),
];

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  ...AMENITY_STATUSES.map((s) => ({ label: s.replace(/_/g, " "), value: s })),
];

export default function AmenitiesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeTowerIds, setActiveTowerIds] = useState<string[]>([]);

  const [draftCategory, setDraftCategory] = useState("all");
  const [draftType, setDraftType] = useState("all");
  const [draftStatus, setDraftStatus] = useState("all");
  const [draftTowerIds, setDraftTowerIds] = useState<string[]>([]);

  const { data: amenities, isLoading, refetch } = useGetAmenities({
    search: searchQuery || undefined,
    category: activeCategory,
    type: activeType,
    status: activeStatus,
    towerIds: activeTowerIds.length > 0 ? activeTowerIds : undefined,
  });
  const { data: me } = useGetMe();
  const { data: towers } = useGetTowers();

  const isAdmin = me?.role === "ADMIN";

  const towerOptions = useMemo(() => {
    if (!towers) return [];
    return towers.map((t) => ({ label: t.towerName, value: t.towerId }));
  }, [towers]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "all") count++;
    if (activeType !== "all") count++;
    if (activeStatus !== "all") count++;
    if (activeTowerIds.length > 0) count++;
    return count;
  }, [activeCategory, activeType, activeStatus, activeTowerIds]);

  const openFilterModal = () => {
    setDraftCategory(activeCategory);
    setDraftType(activeType);
    setDraftStatus(activeStatus);
    setDraftTowerIds(activeTowerIds);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setActiveCategory(draftCategory);
    setActiveType(draftType);
    setActiveStatus(draftStatus);
    setActiveTowerIds(draftTowerIds);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setDraftCategory("all");
    setDraftType("all");
    setDraftStatus("all");
    setDraftTowerIds([]);
  };

  const toggleTowerId = (towerId: string) => {
    setDraftTowerIds((prev) =>
      prev.includes(towerId) ? prev.filter((id) => id !== towerId) : [...prev, towerId],
    );
  };

  if (isLoading) return <LoadingScreen title="Amenities" />;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Amenities"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <View style={styles.headerActions}>
            {isAdmin && (
              <IconButton
                onPress={() => router.push(Routes.Amenities.Create)}
                icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
                variant="ghost"
                size="sm"
              />
            )}
            <IconButton
              onPress={() => router.push(Routes.Amenities.Bookings.Index)}
              icon={<Ionicons name="time-outline" size={24} color={theme.colors.text} />}
              variant="ghost"
              size="sm"
            />
          </View>
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
            <TextInput
              placeholder="Search amenities..."
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
          <TouchableOpacity onPress={openFilterModal} style={styles.filterButton}>
            <Ionicons name="options-outline" size={22} color={theme.colors.text} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={amenities}
        keyExtractor={(item) => item.amenityId}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={({ item }: { item: AmenityData }) => {
          const thumbnailUrl = item.thumbnailFile?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop";
          return (
            <Card
              variant="flat"
              style={styles.card}
              onPress={() => router.push(Routes.Amenities.Details(item.amenityId))}
            >
              <Image source={{ uri: thumbnailUrl }} style={styles.image} />
              <View style={styles.footerRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.location}>{item.location || "Society Grounds"}</Text>
                </View>
                <Badge variant={item.status === "ACTIVE" ? "success" : "warning"}>
                  {item.status === "ACTIVE" ? "Active" : "Maintenance"}
                </Badge>
              </View>
            </Card>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState icon="business-outline" title="No amenities found" />
        }
      />

      <Modal
        transparent
        visible={filterModalVisible}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[]}
              ListHeaderComponent={
                <View style={styles.modalBody}>
                  <Text style={styles.filterSectionLabel}>Category</Text>
                  <View style={styles.optionRow}>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setDraftCategory(opt.value)}
                        style={[
                          styles.optionChip,
                          draftCategory === opt.value && styles.optionChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            draftCategory === opt.value && styles.optionChipTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.filterDivider} />

                  <Text style={styles.filterSectionLabel}>Type</Text>
                  <View style={styles.optionRow}>
                    {TYPE_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setDraftType(opt.value)}
                        style={[
                          styles.optionChip,
                          draftType === opt.value && styles.optionChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            draftType === opt.value && styles.optionChipTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.filterDivider} />

                  <Text style={styles.filterSectionLabel}>Status</Text>
                  <View style={styles.optionRow}>
                    {STATUS_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setDraftStatus(opt.value)}
                        style={[
                          styles.optionChip,
                          draftStatus === opt.value && styles.optionChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            draftStatus === opt.value && styles.optionChipTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {towerOptions.length > 0 && (
                    <>
                      <View style={styles.filterDivider} />
                      <Text style={styles.filterSectionLabel}>Towers</Text>
                      {towerOptions.map((tower) => {
                        const selected = draftTowerIds.includes(tower.value);
                        return (
                          <TouchableOpacity
                            key={tower.value}
                            onPress={() => toggleTowerId(tower.value)}
                            style={styles.towerRow}
                          >
                            <Text style={styles.towerLabel}>{tower.label}</Text>
                            <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                              {selected && (
                                <Ionicons name="checkmark" size={16} color="#fff" />
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  )}
                </View>
              }
              renderItem={() => null}
            />

            <View style={styles.modalFooter}>
              <Button variant="outline" style={styles.footerButton} onPress={clearFilters}>
                Clear
              </Button>
              <Button style={styles.footerButton} onPress={applyFilters}>
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  searchRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: theme.fontWeights.bold,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 112,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  infoCol: {
    gap: 2,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  location: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  optionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  optionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  optionChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  optionChipTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeights.semibold,
  },
  filterDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  towerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  towerLabel: {
    fontSize: 15,
    color: theme.colors.text,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modalFooter: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
    height: 48,
  },
});

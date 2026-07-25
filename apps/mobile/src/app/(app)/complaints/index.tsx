import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/date";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useGetComplaints, useAccessControl } from "@repo/operations";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, AclResource } from "@repo/schema";
import LoadingScreen from "@/components/layout/loading-screen";
import { EmptyState } from "@/components/layout/empty-state";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  ...COMPLAINT_STATUSES.map((s) => ({ label: STATUS_LABELS[s] || s, value: s })),
];

const CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  ...COMPLAINT_CATEGORIES.map((c) => ({ label: c.replace(/_/g, " "), value: c })),
];

const STATUS_VARIANTS: Record<string, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  REJECTED: "danger",
};

export default function ComplaintsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [activeStatus, setActiveStatus] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const [draftStatus, setDraftStatus] = useState("all");
  const [draftCategory, setDraftCategory] = useState("all");

  const { canCreate } = useAccessControl(AclResource.COMPLAINTS);

  const { data: complaints, isLoading, refetch } = useGetComplaints({
    search: searchQuery || undefined,
    status: activeStatus,
    category: activeCategory,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeStatus !== "all") count++;
    if (activeCategory !== "all") count++;
    return count;
  }, [activeStatus, activeCategory]);

  const openFilterModal = () => {
    setDraftStatus(activeStatus);
    setDraftCategory(activeCategory);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setActiveStatus(draftStatus);
    setActiveCategory(draftCategory);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setDraftStatus("all");
    setDraftCategory("all");
  };

  if (isLoading) return <LoadingScreen title="Complaints" />;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Complaints"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          canCreate && (
            <IconButton
              onPress={() => router.push(Routes.Complaints.Create)}
              icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
              variant="ghost"
              size="md"
            />
          )
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
            <TextInput
              placeholder="Search complaints..."
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
        data={complaints}
        keyExtractor={(item) => item.complaintId}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.card}
            onPress={() => router.push(Routes.Complaints.Details(item.complaintId))}
          >
            <View style={styles.cardHeader}>
              <View style={styles.categoryWrapper}>
                <Text style={styles.categoryText}>
                  {item.category.replace(/_/g, " ")}
                </Text>
              </View>
              <Badge variant={STATUS_VARIANTS[item.status] || "secondary"}>
                {STATUS_LABELS[item.status] || item.status}
              </Badge>
            </View>
            <Text style={styles.titleText}>{item.subject}</Text>
            <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.dateText}>
              {formatDate(item.createdAt, "short")}
            </Text>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState icon="alert-circle-outline" title="No complaints found." />
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

                  <View style={styles.filterDivider} />

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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  categoryWrapper: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.md,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  titleText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  descText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  separator: {
    height: theme.spacing.md,
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
    maxHeight: "60%",
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

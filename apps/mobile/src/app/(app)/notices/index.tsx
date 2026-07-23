import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { useRouter } from "expo-router";
import { useGetNotices, useGetTowers } from "@repo/operations";
import { NoticeData, RECIPIENT_OPTIONS, NOTICE_STATUS_OPTIONS } from "@repo/schema";
import { formatDate, isRecent } from "@/utils/notice";
import { EmptyState } from "@/components/layout/empty-state";
import LoadingScreen from "@/components/layout/loading-screen";

const RECIPIENT_LABELS: Record<string, { label: string; variant: "success" | "warning" }> = {
  residents: { label: "Residents", variant: "success" },
  guard: { label: "Guards", variant: "warning" },
};

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  ...NOTICE_STATUS_OPTIONS,
];

const FILTER_RECIPIENT_OPTIONS = [
  { label: "All", value: "all" },
  ...RECIPIENT_OPTIONS,
];

const statusSort = (a: NoticeData, b: NoticeData) => {
  if (a.status === "published" && b.status !== "published") return -1;
  if (a.status !== "published" && b.status === "published") return 1;
  return 0;
};

export default function NoticesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [activeStatus, setActiveStatus] = useState("all");
  const [activeRecipient, setActiveRecipient] = useState("all");
  const [activeTowerIds, setActiveTowerIds] = useState<string[]>([]);

  const [draftStatus, setDraftStatus] = useState("all");
  const [draftRecipient, setDraftRecipient] = useState("all");
  const [draftTowerIds, setDraftTowerIds] = useState<string[]>([]);

  const { data: notices, isLoading } = useGetNotices({
    search: searchQuery || undefined,
    status: activeStatus,
    recipient: activeRecipient,
  });

  const { data: towers } = useGetTowers();

  const towerOptions = useMemo(() => {
    if (!towers) return [];
    return towers.map((t) => ({ label: t.towerName, value: t.towerId }));
  }, [towers]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeStatus !== "all") count++;
    if (activeRecipient !== "all") count++;
    if (activeTowerIds.length > 0) count++;
    return count;
  }, [activeStatus, activeRecipient, activeTowerIds]);

  const openFilterModal = () => {
    setDraftStatus(activeStatus);
    setDraftRecipient(activeRecipient);
    setDraftTowerIds(activeTowerIds);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setActiveStatus(draftStatus);
    setActiveRecipient(draftRecipient);
    setActiveTowerIds(draftTowerIds);
    setFilterModalVisible(false);
  };

  if (isLoading) return <LoadingScreen title="Notices" />;

  const clearFilters = () => {
    setDraftStatus("all");
    setDraftRecipient("all");
    setDraftTowerIds([]);
  };

  const toggleTowerId = (towerId: string) => {
    setDraftTowerIds((prev) =>
      prev.includes(towerId) ? prev.filter((id) => id !== towerId) : [...prev, towerId],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notices"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Notices.Create)}
            icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
            <TextInput
              placeholder="Search notices..."
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
        data={notices?.slice().sort(statusSort)}
        keyExtractor={(item) => item.noticeId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: notice }) => (
          <Card
            variant="outlined"
            style={styles.noticeCard}
            onPress={() => router.push(Routes.Notices.Details(notice.noticeId))}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                {isRecent(notice.publishedOn || notice.createdAt) && notice.status === "published" && (
                  <View style={styles.newDot} />
                )}
                <Text style={styles.noticeTitle}>{notice.title}</Text>
              </View>
              <Text style={styles.date}>
                {formatDate(notice.publishedOn || notice.createdAt)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Badge variant={notice.status === "published" ? "success" : "secondary"}>
                {notice.status === "published" ? "Published" : "Draft"}
              </Badge>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {notice.description}
            </Text>
            <View style={styles.recipientRow}>
              {notice.recipient?.map((r) => {
                const config = RECIPIENT_LABELS[r];
                return config ? (
                  <Badge key={r} variant={config.variant}>{config.label}</Badge>
                ) : null;
              })}
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState icon="document-text-outline" title="No notices found" />
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

                  <Text style={styles.filterSectionLabel}>Recipient</Text>
                  <View style={styles.optionRow}>
                    {FILTER_RECIPIENT_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setDraftRecipient(opt.value)}
                        style={[
                          styles.optionChip,
                          draftRecipient === opt.value && styles.optionChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            draftRecipient === opt.value && styles.optionChipTextActive,
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
  listContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl * 2,
  },
  noticeCard: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    flexShrink: 1,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  recipientRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
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

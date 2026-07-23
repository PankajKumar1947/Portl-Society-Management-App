import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useGetPolls } from "@repo/operations";
import { PollData, UserRoles, POLL_STATUS_OPTIONS, RECIPIENT_OPTIONS } from "@repo/schema";
import { useRole } from "@/context/role-context";
import PollCard from "./_components/poll-card";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  ...POLL_STATUS_OPTIONS,
];

const FILTER_RECIPIENT_OPTIONS = [
  { label: "All", value: "all" },
  ...RECIPIENT_OPTIONS,
];

const statusSort = (a: PollData, b: PollData) => {
  const order: Record<string, number> = { published: 0, draft: 1, closed: 2 };
  return (order[a.status] ?? 99) - (order[b.status] ?? 99);
};

export default function PollsScreen() {
  const router = useRouter();
  const { role } = useRole();
  const isAdmin = role === UserRoles.ADMIN || role === UserRoles.SUPER_ADMIN;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [activeStatus, setActiveStatus] = useState("all");
  const [activeRecipient, setActiveRecipient] = useState("all");
  const [draftStatus, setDraftStatus] = useState("all");
  const [draftRecipient, setDraftRecipient] = useState("all");

  const { data: polls, isLoading } = useGetPolls({
    search: searchQuery || undefined,
    status: activeStatus !== "all" ? activeStatus : undefined,
    recipient: activeRecipient !== "all" ? activeRecipient : undefined,
  });

  const sortedPolls = useMemo(() => {
    if (!polls) return [];
    return polls.slice().sort(statusSort);
  }, [polls]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeStatus !== "all") count++;
    if (activeRecipient !== "all") count++;
    return count;
  }, [activeStatus, activeRecipient]);

  const openFilterModal = () => {
    setDraftStatus(activeStatus);
    setDraftRecipient(activeRecipient);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setActiveStatus(draftStatus);
    setActiveRecipient(draftRecipient);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setDraftStatus("all");
    setDraftRecipient("all");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Polls"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          isAdmin ? (
            <IconButton
              onPress={() => router.push(Routes.Polls.Create)}
              icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
              variant="ghost"
            />
          ) : null
        }
      />

      {isAdmin && (
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
              <TextInput
                placeholder="Search polls..."
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
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sortedPolls}
          keyExtractor={(item) => item.pollId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PollCard
              poll={item}
              onVotePress={() => router.push(Routes.Polls.Details(item.pollId))}
              onCardPress={() => router.push(Routes.Polls.Details(item.pollId))}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>No polls found</Text>
            </View>
          }
        />
      )}

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
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  emptyState: {
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

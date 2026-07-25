import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal as RNModal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/date";
import {
  TICKET_STATUS_LABEL,
  TICKET_STATUS_VARIANT,
  TICKET_CATEGORY_LABEL,
  TicketStatus,
  TicketCategory,
  STATUS_FILTER_OPTIONS,
  CATEGORY_FILTER_OPTIONS,
} from "@repo/schema";
import { useGetHelpdeskTickets } from "@repo/operations";
import { theme, Routes } from "@/constants";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LoadingScreen from "@/components/layout/loading-screen";

export default function TicketsContent() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [filterVisible, setFilterVisible] = useState(false);
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [draftStatus, setDraftStatus] = useState("all");
  const [draftCategory, setDraftCategory] = useState("all");

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchQuery]);

  const { data: tickets, isLoading } = useGetHelpdeskTickets({
    search: debouncedSearch || undefined,
    status: activeStatus !== "all" ? activeStatus : undefined,
    category: activeCategory !== "all" ? activeCategory : undefined,
  });

  const openFilter = () => {
    setDraftStatus(activeStatus);
    setDraftCategory(activeCategory);
    setFilterVisible(true);
  };

  const applyFilters = () => {
    setActiveStatus(draftStatus);
    setActiveCategory(draftCategory);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setDraftStatus("all");
    setDraftCategory("all");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeStatus !== "all") count++;
    if (activeCategory !== "all") count++;
    return count;
  }, [activeStatus, activeCategory]);

  const hasActiveFilters = searchQuery || activeStatus !== "all" || activeCategory !== "all";

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search tickets..."
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
        <TouchableOpacity onPress={openFilter} style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color={theme.colors.text} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingScreen title="" />
        </View>
      ) : (
        <FlatList
          data={tickets || []}
          keyExtractor={(item) => item.ticketId}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="ticket-outline" size={48} color={theme.colors.textMuted} />
              <Text style={styles.emptyTitle}>
                {hasActiveFilters ? "No matching tickets" : "No tickets yet"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Raise a new ticket for any issue in your society"}
              </Text>
              <Button
                variant="primary"
                style={styles.emptyButton}
                onPress={() => router.push(Routes.Helpdesk.Create)}
              >
                Raise a Ticket
              </Button>
            </View>
          }
          renderItem={({ item }) => (
            <Card
              variant="flat"
              style={styles.card}
              onPress={() => router.push(Routes.Helpdesk.Details(item.ticketId))}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>#{item.ticketId.slice(0, 8)}</Text>
                <Badge variant={TICKET_STATUS_VARIANT[item.status as TicketStatus] || "warning"}>
                  {TICKET_STATUS_LABEL[item.status as TicketStatus] || item.status}
                </Badge>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.subject}
              </Text>
              <View style={styles.cardMeta}>
                <Badge variant="primary">
                  {TICKET_CATEGORY_LABEL[item.category as TicketCategory] || item.category}
                </Badge>
                {item.createdAt && (
                  <Text style={styles.cardDate}>
                    {formatDate(item.createdAt, "short")}
                  </Text>
                )}
              </View>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </Card>
          )}
        />
      )}

      <RNModal transparent visible={filterVisible} animationType="fade" onRequestClose={() => setFilterVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close-outline" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterSectionLabel}>Status</Text>
              <View style={styles.optionRow}>
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setDraftStatus(opt.value)}
                    style={[styles.optionChip, draftStatus === opt.value && styles.optionChipActive]}
                  >
                    <Text style={[styles.optionChipText, draftStatus === opt.value && styles.optionChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.filterDivider} />

              <Text style={styles.filterSectionLabel}>Category</Text>
              <View style={styles.optionRow}>
                {CATEGORY_FILTER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setDraftCategory(opt.value)}
                    style={[styles.optionChip, draftCategory === opt.value && styles.optionChipActive]}
                  >
                    <Text style={[styles.optionChipText, draftCategory === opt.value && styles.optionChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button variant="outline" style={styles.footerButton} onPress={clearFilters}>
                Clear
              </Button>
              <Button style={styles.footerButton} onPress={applyFilters}>
                Save
              </Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  searchRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardId: {
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textMuted,
    fontFamily: "monospace",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  cardDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingTop: theme.spacing.lg,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  modalBody: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  optionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  optionChipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  optionChipTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeights.bold,
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
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
    height: 48,
  },
});

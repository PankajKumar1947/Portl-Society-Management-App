import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { theme } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/layout/empty-state";
import { useGetVisitorLogs, useAccessControl, useGetTowers } from "@repo/operations";
import { AclResource, SCAN_DIRECTION } from "@repo/schema";
import {
  formatTime,
  formatPickerDate,
  getDateRange,
  extractEvents,
  groupByDate,
  DateFilter,
  DATE_FILTER_OPTIONS,
} from "../../../utils/logs.utils";

export default function LogsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [showFilters, setShowFilters] = useState(false);
  const [customFrom, setCustomFrom] = useState(new Date());
  const [customTo, setCustomTo] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const apiParams = useMemo(() => {
    const trimmed = debouncedSearch.trim();
    if (dateFilter === "all" && !trimmed) return undefined;
    const params: { search?: string; dateFrom?: string; dateTo?: string } = {};
    if (trimmed) params.search = trimmed;
    if (dateFilter !== "all") {
      const { start, end } = getDateRange(dateFilter, customFrom, customTo);
      params.dateFrom = start.toISOString();
      params.dateTo = end.toISOString();
    }
    return params;
  }, [debouncedSearch, dateFilter, customFrom, customTo]);

  const { data: logs = [], isLoading, refetch } = useGetVisitorLogs(apiParams);

  const { canViewModule } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const { data: towers = [] } = useGetTowers({ enabled: canViewTower || canViewFlat });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  const sections = useMemo(() => {
    const allEvents = extractEvents(logs, towerMap);
    return groupByDate(allEvents);
  }, [logs, towerMap]);

  const totalCount = useMemo(() => sections.reduce((sum, s) => sum + s.data.length, 0), [sections]);

  const handleFromChange = useCallback((_e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowFromPicker(false);
    if (d) {
      setCustomFrom(d);
      if (d > customTo) setCustomTo(d);
    }
  }, [customTo]);

  const handleToChange = useCallback((_e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowToPicker(false);
    if (d) {
      setCustomTo(d);
      if (d < customFrom) setCustomFrom(d);
    }
  }, [customFrom]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Visitor Logs"
        rightElement={
          <TouchableOpacity
            onPress={() => setShowFilters((v) => !v)}
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={showFilters ? "#fff" : theme.colors.text}
            />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={16} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search visitor..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        <Text style={styles.countText}>{totalCount}</Text>
      </View>

      {showFilters && (
        <View style={styles.filterPanel}>
          <View style={styles.filterBar}>
            {DATE_FILTER_OPTIONS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, dateFilter === f.key && styles.filterChipActive]}
                onPress={() => setDateFilter(f.key)}
              >
                <Text style={[styles.filterChipText, dateFilter === f.key && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {dateFilter === "custom" && (
            <View style={styles.customDateRow}>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowFromPicker(true)}
              >
                <Text style={styles.dateLabel}>From</Text>
                <Text style={styles.dateValue}>{formatPickerDate(customFrom)}</Text>
              </TouchableOpacity>
              <Text style={styles.dateSep}>→</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowToPicker(true)}
              >
                <Text style={styles.dateLabel}>To</Text>
                <Text style={styles.dateValue}>{formatPickerDate(customTo)}</Text>
              </TouchableOpacity>
            </View>
          )}

          {showFromPicker && (
            <DateTimePicker
              value={customFrom}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              maximumDate={new Date()}
              onChange={handleFromChange}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={customTo}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              maximumDate={new Date()}
              onChange={handleToChange}
            />
          )}
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No matching events"
            description={searchQuery ? "Try a different name." : "No visitor activity in this period."}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.eventRow}>
            <Badge
              variant={item.action === SCAN_DIRECTION.ENTRY ? "success" : "warning"}
              style={styles.actionBadge}
            >
              {item.action === SCAN_DIRECTION.ENTRY ? "IN" : "OUT"}
            </Badge>

            <View style={styles.timeCol}>
              <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.visitorName} numberOfLines={1}>{item.visitorName}</Text>
              <View style={styles.metaRow}>
                {(canViewTower && item.towerName) && (
                  <Text style={styles.metaText} numberOfLines={1}>{item.towerName}</Text>
                )}
                {(canViewFlat && item.flatNumber) && (
                  <>
                    {(canViewTower && item.towerName) && <Text style={styles.metaSep}>•</Text>}
                    <Text style={styles.metaText}>{item.flatNumber}</Text>
                  </>
                )}
              </View>
              {item.scannedBy && (
                <View style={styles.scannedRow}>
                  <Ionicons name="shield-checkmark-outline" size={11} color={theme.colors.textMuted} />
                  <Text style={styles.scannedText}>{item.scannedBy}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  filterToggleActive: {
    backgroundColor: theme.colors.primary,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    height: 38,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    padding: 0,
  },
  countText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textMuted,
    minWidth: 24,
    textAlign: "right",
  },
  filterPanel: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingBottom: theme.spacing.sm,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#fff",
  },
  customDateRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dateBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginTop: 2,
  },
  dateSep: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  list: {
    paddingBottom: theme.spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeights.semibold,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  timelineCol: {
    width: 12,
    alignItems: "center",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  entryDot: {
    backgroundColor: theme.colors.success,
  },
  exitDot: {
    backgroundColor: theme.colors.warning,
  },
  timeCol: {
    width: 90,
  },
  timeText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 42,
    alignItems: "center",
  },
  infoCol: {
    flex: 1,
    gap: 1,
  },
  visitorName: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  metaSep: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  scannedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  scannedText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.lg,
  },
});

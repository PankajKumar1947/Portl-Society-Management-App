import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Modal,
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
} from "@/utils/logs.utils";

export default function LogsScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [directionFilter, setDirectionFilter] = useState<"ALL" | "IN" | "OUT">("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [showFilters, setShowFilters] = useState(false);
  const [customFrom, setCustomFrom] = useState(new Date());
  const [customTo, setCustomTo] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const apiParams = useMemo(() => {
    const params: { dateFrom?: string; dateTo?: string; direction?: string } = {};
    if (dateFilter !== "all") {
      const { start, end } = getDateRange(dateFilter, customFrom, customTo);
      params.dateFrom = start.toISOString();
      params.dateTo = end.toISOString();
    }
    if (directionFilter !== "ALL") {
      params.direction = directionFilter;
    }
    return params;
  }, [dateFilter, customFrom, customTo, directionFilter]);

  const { data: logs = [], isLoading, refetch } = useGetVisitorLogs(apiParams);

  const { canViewModule } = useAccessControl();
  const canViewTower = canViewModule(AclResource.TOWERS);
  const canViewFlat = canViewModule(AclResource.FLATS);
  const { data: towers = [] } = useGetTowers({ enabled: canViewTower || canViewFlat });
  const towerMap = useMemo(() => new Map(towers.map((t) => [t.towerId, t.towerName])), [towers]);

  const sections = useMemo(() => {
    let allEvents = extractEvents(logs, towerMap);
    if (activeTab === "visitors") {
      allEvents = allEvents.filter((e) => {
        const type = e.visitorType.toLowerCase();
        return type !== "resident" && type !== "family_member";
      });
    } else if (activeTab === "residents") {
      allEvents = allEvents.filter((e) => {
        const type = e.visitorType.toLowerCase();
        return type === "resident" || type === "family_member";
      });
    }

    if (directionFilter === "IN") {
      allEvents = allEvents.filter((e) => e.action === SCAN_DIRECTION.ENTRY);
    } else if (directionFilter === "OUT") {
      allEvents = allEvents.filter((e) => e.action === SCAN_DIRECTION.EXIT);
    }

    return groupByDate(allEvents);
  }, [logs, towerMap, activeTab, directionFilter]);

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

  const handleClearFilters = useCallback(() => {
    setDateFilter("all");
    setDirectionFilter("ALL");
    setCustomFrom(new Date());
    setCustomTo(new Date());
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Activity Logs"
        showBack={true}
      />

      <View style={styles.tabRow}>
        <View style={[styles.segmentContainer, { flex: 1 }]}>
          <TouchableOpacity
            style={[styles.segmentButton, activeTab === "all" && styles.segmentButtonActive]}
            onPress={() => setActiveTab("all")}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === "all" && styles.segmentTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, activeTab === "visitors" && styles.segmentButtonActive]}
            onPress={() => setActiveTab("visitors")}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === "visitors" && styles.segmentTextActive]}>
              Visitors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, activeTab === "residents" && styles.segmentButtonActive]}
            onPress={() => setActiveTab("residents")}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === "residents" && styles.segmentTextActive]}>
              Residents
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={[styles.filterBtn, dateFilter !== "all" && styles.filterBtnActive]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={dateFilter !== "all" ? "#fff" : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilters(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Logs</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
                <TouchableOpacity onPress={handleClearFilters} activeOpacity={0.7}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <Ionicons name="close-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>Date Period</Text>
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

            <Text style={styles.modalSectionTitle}>Direction</Text>
            <View style={styles.filterBar}>
              {(["ALL", "IN", "OUT"] as const).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.filterChip, directionFilter === d && styles.filterChipActive]}
                  onPress={() => setDirectionFilter(d)}
                >
                  <Text style={[styles.filterChipText, directionFilter === d && styles.filterChipTextActive]}>
                    {d === "ALL" ? "All" : d === "IN" ? "In Only" : "Out Only"}
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

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setShowFilters(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
            description="No visitor activity in this period."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.eventRow}>
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
            </View>

            <View style={styles.typeCol}>
              {(item.visitorType.toLowerCase() === "resident" || item.visitorType.toLowerCase() === "family_member") ? (
                <Badge variant="success">Resident</Badge>
              ) : (
                <Badge variant="secondary">Visitor</Badge>
              )}
            </View>

            <View style={styles.timeCol}>
              <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
            </View>

            <Badge
              variant={item.action === SCAN_DIRECTION.ENTRY ? "success" : "warning"}
              style={styles.actionBadge}
            >
              {item.action === SCAN_DIRECTION.ENTRY ? "IN" : "OUT"}
            </Badge>
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
    marginBottom: 50
  },
  filterTabs: {
    marginBottom: theme.spacing.xs,
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
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.sm,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 46,
    alignItems: "center",
  },
  segmentButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.full,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  segmentTextActive: {
    color: theme.colors.text,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  clearText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
  },
  applyBtn: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
  },
  filterPanel: {
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
  typeCol: {
    width: 75,
    alignItems: "flex-start",
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

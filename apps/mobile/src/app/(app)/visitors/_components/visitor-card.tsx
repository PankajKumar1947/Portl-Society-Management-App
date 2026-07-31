import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@/components/ui/card";
import { PersonListItem } from "@/components/ui/person-list-item";
import { theme } from "@/constants";
import { VisitorStatusBadge } from "./visitor-status-badge";

export interface VisitorCardProps {
  item: {
    logId: string;
    name: string;
    type: string;
    status: string;
    flat?: {
      towerId: string;
      flatNumber: string;
    };
  };
  isResidentCategory: boolean;
  onPress: () => void;
  shouldFetchTowers: boolean;
  canViewTower: boolean;
  canViewFlat: boolean;
  towerMap: Map<string, string>;
}

export const VisitorCard: React.FC<VisitorCardProps> = ({
  item,
  isResidentCategory,
  onPress,
  shouldFetchTowers,
  canViewTower,
  canViewFlat,
  towerMap,
}) => {
  return (
    <Card variant="flat" style={styles.card} onPress={onPress}>
      <PersonListItem
        name={item.name}
        subtitle={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        rightElement={
          <VisitorStatusBadge
            status={item.status}
            isResidentCategory={isResidentCategory}
          />
        }
      />
      {shouldFetchTowers && item.flat && (
        <View style={styles.locationRow}>
          {canViewTower && towerMap.get(item.flat.towerId) && (
            <Text style={styles.locationText}>{towerMap.get(item.flat.towerId)}</Text>
          )}
          {canViewTower && canViewFlat && <Text style={styles.locationSep}>•</Text>}
          {canViewFlat && (
            <Text style={styles.locationText}>{item.flat.flatNumber}</Text>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 0,
    overflow: "hidden",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  locationSep: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginHorizontal: 2,
  },
});

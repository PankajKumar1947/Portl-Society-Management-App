import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export interface TowerItem {
  id: string;
  towerName: string;
  location: string;
  appNumber: string;
  flatsCount: number;
}

interface TowerCardProps {
  item: TowerItem;
  onPress: () => void;
}

export const TowerCard: React.FC<TowerCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card variant="flat" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={24} color={theme.colors.primaryDark} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.towerName}>{item.towerName}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.badgeRow}>
            <Text style={styles.appNumberText}>App No: {item.appNumber}</Text>
          </View>
          <Badge variant="primary">
            {`${item.flatsCount} Flats`}
          </Badge>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  towerName: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  appNumberText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
});

export default TowerCard;

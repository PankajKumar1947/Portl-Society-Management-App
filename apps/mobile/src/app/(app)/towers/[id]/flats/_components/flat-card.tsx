import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { FlatStatus } from "@repo/schema";

export interface FlatItem {
  id: string;
  flatNumber: string;
  floorNumber: number;
  rooms: number;
  bathrooms: number;
  status: FlatStatus;
  residentsCount: number;
}

interface FlatCardProps {
  item: FlatItem;
  onPress: () => void;
}

const STATUS_BADGE_VARIANT: Record<FlatStatus, "success" | "warning" | "danger"> = {
  OCCUPIED: "success",
  VACANT: "warning",
  UNDER_MAINTENANCE: "danger",
};

export const FlatCard: React.FC<FlatCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card variant="flat" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="home-outline" size={22} color={theme.colors.primaryDark} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.flatNumber}>Flat {item.flatNumber}</Text>
            <Text style={styles.floorText}>
              Floor {item.floorNumber} • {item.rooms} BHK
            </Text>
          </View>
          <Badge variant={STATUS_BADGE_VARIANT[item.status]}>
            {item.status}
          </Badge>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.amenitiesText}>
            {item.rooms} Rooms • {item.bathrooms} Baths
          </Text>
          <Text style={styles.residentText}>{item.residentsCount} Residents</Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  flatNumber: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  floorText: {
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
  amenitiesText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  residentText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primaryDark,
  },
});

export default FlatCard;

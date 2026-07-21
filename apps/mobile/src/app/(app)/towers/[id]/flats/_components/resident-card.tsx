import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import Badge from "@/components/ui/badge";

export interface Resident {
  id: string;
  name: string;
  role: string;
  phone: string;
  isPrimary: boolean;
}

interface ResidentCardProps {
  resident: Resident;
}

export const ResidentCard: React.FC<ResidentCardProps> = ({ resident }) => {
  return (
    <View style={styles.residentRow}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
      </View>
      <View style={styles.residentInfo}>
        <View style={styles.nameBadgeRow}>
          <Text style={styles.residentName}>{resident.name}</Text>
          {resident.isPrimary && <Badge variant="primary">Primary</Badge>}
        </View>
        <Text style={styles.residentRole}>
          {resident.role} • {resident.phone}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  residentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  residentInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  residentName: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  residentRole: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default ResidentCard;

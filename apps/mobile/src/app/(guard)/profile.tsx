import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../constants";
import { useRole, UserRole } from "../../context/role-context";
import Button from "../../components/ui/button";
import Card from "../../components/ui/card";
import { useRouter } from "expo-router";
import { Routes } from "../../constants/routes";

export default function GuardProfileScreen() {
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    router.replace(Routes.Root);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guard Profile</Text>
      <Text style={styles.subtitle}>Gate operator account settings.</Text>

      <Card variant="flat" style={styles.roleCard}>
        <Text style={styles.sectionTitle}>Simulate Roles</Text>
        <Text style={styles.sectionDesc}>
          Toggle between roles to see different user dashboards:
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            variant={role === "resident" ? "primary" : "outline"}
            size="sm"
            onPress={() => handleRoleChange("resident")}
            style={styles.roleButton}
          >
            Resident
          </Button>
          <Button
            variant={role === "guard" ? "primary" : "outline"}
            size="sm"
            onPress={() => handleRoleChange("guard")}
            style={styles.roleButton}
          >
            Guard
          </Button>
          <Button
            variant={role === "admin" ? "primary" : "outline"}
            size="sm"
            onPress={() => handleRoleChange("admin")}
            style={styles.roleButton}
          >
            Admin
          </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xxl,
  },
  roleCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  roleButton: {
    flex: 1,
    paddingVertical: theme.spacing.xs * 1.5,
  },
});

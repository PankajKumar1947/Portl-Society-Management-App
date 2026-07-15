import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../constants";

export default function HelpdeskScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Helpdesk</Text>
      <Text style={styles.subtitle}>Raise tickets, track status, and chat with administration.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

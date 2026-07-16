import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../constants";

export default function GuardLogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visitor Logs</Text>
      <Text style={styles.subtitle}>Check complete records of entries and exits.</Text>
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
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

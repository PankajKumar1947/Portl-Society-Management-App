import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { useGetSocietyStats } from "@repo/operations";
import type { SocietyStats } from "@repo/schema";
import StatCard from "./_components/stat-card";

const STATS_CONFIG: Array<{
  key: keyof SocietyStats;
  label: string;
  icon: "business-outline" | "home-outline" | "people-outline" | "shield-checkmark-outline" | "car-sport-outline" | "megaphone-outline" | "stats-chart-outline" | "alert-circle-outline";
  color: string;
}> = [
  { key: "towers", label: "Towers", icon: "business-outline", color: theme.colors.primary },
  { key: "flats", label: "Flats", icon: "home-outline", color: "#6C63FF" },
  { key: "residents", label: "Residents", icon: "people-outline", color: "#00B894" },
  { key: "guards", label: "Guards", icon: "shield-checkmark-outline", color: "#E17055" },
  { key: "vehicles", label: "Vehicles", icon: "car-sport-outline", color: "#FDCB6E" },
  { key: "notices", label: "Notices", icon: "megaphone-outline", color: "#A29BFE" },
  { key: "polls", label: "Polls", icon: "stats-chart-outline", color: "#00CEC9" },
  { key: "complaints", label: "Complaints", icon: "alert-circle-outline", color: "#FF7675" },
];

export default function SocietyStatsScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // API is only called when this screen mounts
  const { data: stats, isLoading } = useGetSocietyStats();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Society Overview" onBack={() => router.back()} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>Live stats across your society</Text>

          <View style={styles.grid}>
            {STATS_CONFIG.map(({ key, label, icon, color }) => (
              <StatCard
                key={key}
                icon={icon}
                label={label}
                value={stats?.[key] ?? 0}
                color={color}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
});

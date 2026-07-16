import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import ProfileRow from "@/components/ui/profile-row";

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Settings" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.card}>
            <ProfileRow
              icon="notifications-outline"
              title="Push Notifications"
              rightElement={
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFF"
                />
              }
            />
            <ProfileRow
              icon="language-outline"
              title="Language"
              subtitle="English"
              onPress={() => {}}
            />
            <ProfileRow
              icon="color-palette-outline"
              title="Theme"
              subtitle="System Default"
              onPress={() => {}}
              showBorder={false}
            />
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Security</Text>
          <View style={styles.card}>
            <ProfileRow
              icon="lock-closed-outline"
              title="Change Password"
              onPress={() => {}}
            />
            <ProfileRow
              icon="finger-print-outline"
              title="Biometric Login"
              showBorder={false}
              rightElement={
                <Switch
                  value={biometricsEnabled}
                  onValueChange={setBiometricsEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFF"
                />
              }
            />
          </View>
        </View>

        {/* Legal Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.card}>
            <ProfileRow
              icon="document-text-outline"
              title="Privacy Policy"
              onPress={() => {}}
            />
            <ProfileRow
              icon="shield-checkmark-outline"
              title="Terms & Conditions"
              onPress={() => {}}
              showBorder={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.xs,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    marginBottom: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
});

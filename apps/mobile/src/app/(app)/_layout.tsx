import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { theme } from "../../constants";
import { useRole } from "../../context/role-context";

const ROLE_TABS: Record<string, { name: string; title: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[]> = {
  resident: [
    { name: "index", title: "Home", icon: "home-outline", activeIcon: "home" },
    { name: "visitors", title: "Visitors", icon: "people-outline", activeIcon: "people" },
    { name: "community/index", title: "Community", icon: "people-circle-outline", activeIcon: "people-circle" },
    { name: "amenities", title: "Amenities", icon: "business-outline", activeIcon: "business" },
    { name: "profile", title: "Profile", icon: "person-outline", activeIcon: "person" },
  ],
  admin: [
    { name: "index", title: "Dashboard", icon: "grid-outline", activeIcon: "grid" },
    { name: "operations", title: "Operations", icon: "settings-outline", activeIcon: "settings" },
    { name: "community/index", title: "Community", icon: "people-circle-outline", activeIcon: "people-circle" },
    { name: "profile", title: "Profile", icon: "person-outline", activeIcon: "person" },
  ],
  guard: [
    { name: "index", title: "Gate Home", icon: "shield-outline", activeIcon: "shield" },
    { name: "log", title: "Visitor Log", icon: "list-outline", activeIcon: "list" },
    { name: "notices/index", title: "Notices", icon: "notifications-outline", activeIcon: "notifications" },
    { name: "profile", title: "Profile", icon: "person-outline", activeIcon: "person" },
  ],
};

export default function AppLayout() {
  const { role } = useRole();
  const currentRole = role ?? "resident";
  const tabs = ROLE_TABS[currentRole] ?? ROLE_TABS.resident;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen name="notices/index" options={{ href: null }} />
      <Tabs.Screen name="notices/create" options={{ href: null }} />
      <Tabs.Screen name="notices/[id]" options={{ href: null }} />

      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Ionicons
                  name={focused ? tab.activeIcon : tab.icon}
                  size={22}
                  color={focused ? theme.colors.text : color}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl * 1.5,
    height: 72,
    borderTopWidth: 0,
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.06)",
      },
    }),
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeights.bold,
    marginTop: 6,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconWrapperActive: {
    backgroundColor: theme.colors.primary,
  },
});

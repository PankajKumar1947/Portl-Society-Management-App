import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
    { name: "notices", title: "Notices", icon: "notifications-outline", activeIcon: "notifications" },
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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontSize: theme.spacing.md, fontWeight: theme.fontWeights.semibold },
      }}
    >
      <Tabs.Screen name="notices" options={{ href: null }} />
      <Tabs.Screen name="helpdesk" options={{ href: null }} />
      <Tabs.Screen name="polls" options={{ href: null }} />

      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={theme.spacing.xxl}
                color={focused ? theme.colors.primary : color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}


import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import { useRole } from "../../context/role-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: theme.fontWeights.semibold },
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      {tabs.map((tab) => {
        const isCommunity = tab.name === "community/index";
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarLabel: isCommunity ? () => null : tab.title,
              tabBarIcon: ({ color, focused }) => {
                if (isCommunity) {
                  return (
                    <View style={[styles.communityTabContainer, focused && styles.communityTabContainerActive]}>
                      <Ionicons
                        name={focused ? tab.activeIcon : tab.icon}
                        size={28}
                        color={theme.colors.surface}
                      />
                    </View>
                  );
                }
                return (
                  <Ionicons
                    name={focused ? tab.activeIcon : tab.icon}
                    size={theme.spacing.xxl}
                    color={focused ? theme.colors.primary : color}
                  />
                );
              },
            }}
          />
        );
      })}

      <Tabs.Screen name="society" options={{ href: null }} />
      <Tabs.Screen name="towers" options={{ href: null }} />
      <Tabs.Screen name="residents" options={{ href: null }} />
      <Tabs.Screen name="notices" options={{ href: null }} />
      <Tabs.Screen name="helpdesk" options={{ href: null }} />
      <Tabs.Screen name="polls" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="complaints" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  communityTabContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    top: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  communityTabContainerActive: {
    backgroundColor: theme.colors.primaryDark,
    transform: [{ scale: 1.05 }],
  },
});


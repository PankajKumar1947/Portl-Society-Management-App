import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoleProvider } from "@/context/role-context";
import { AccessControlProvider } from "@repo/operations";

interface TabDef {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  isCommunity?: boolean;
}

const ALL_TABS: TabDef[] = [
  { name: "index", title: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "visitors", title: "Visitors", icon: "people-outline", activeIcon: "people" },
  { name: "community/index", title: "Community", icon: "people-circle-outline", activeIcon: "people-circle", isCommunity: true },
  { name: "amenities", title: "Amenities", icon: "business-outline", activeIcon: "business" },
  { name: "profile", title: "Profile", icon: "person-outline", activeIcon: "person" },
];

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <RoleProvider>
      <AccessControlProvider>
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
          {ALL_TABS.map((tab) => {
            const isCommunity = tab.isCommunity;
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
          <Tabs.Screen name="guards" options={{ href: null }} />
          <Tabs.Screen name="notices" options={{ href: null }} />
          <Tabs.Screen name="helpdesk" options={{ href: null }} />
          <Tabs.Screen name="polls" options={{ href: null }} />
          <Tabs.Screen name="notifications" options={{ href: null }} />
          <Tabs.Screen name="complaints" options={{ href: null }} />
        </Tabs>
      </AccessControlProvider>
    </RoleProvider>
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

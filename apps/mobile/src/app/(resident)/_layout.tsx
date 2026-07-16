import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { theme } from "../../constants";

export default function ResidentLayout() {
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
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={focused ? theme.colors.text : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="visitors"
        options={{
          title: "Visitors",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={22}
                color={focused ? theme.colors.text : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="amenities"
        options={{
          title: "Amenities",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? "business" : "business-outline"}
                size={22}
                color={focused ? theme.colors.text : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="helpdesk"
        options={{
          title: "Helpdesk",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
                size={22}
                color={focused ? theme.colors.text : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={focused ? theme.colors.text : color}
              />
            </View>
          ),
        }}
      />
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
    fontWeight: "700",
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

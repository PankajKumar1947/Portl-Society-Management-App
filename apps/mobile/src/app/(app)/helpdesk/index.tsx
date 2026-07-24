import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { useGetMySociety } from "@repo/operations";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import LoadingScreen from "@/components/layout/loading-screen";
import TicketsContent from "./_components/tickets-content";
import ContactContent from "./_components/contact-content";

const TABS = [
  { id: "tickets", label: "Tickets" },
  { id: "contact", label: "Contact" },
];

export default function HelpdeskScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tickets");

  const { data: society, isLoading: societyLoading } = useGetMySociety();

  if (societyLoading) {
    return <LoadingScreen title="Helpdesk" onBack={() => router.replace(Routes.Root)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Helpdesk"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Helpdesk.Create)}
            icon={<Ionicons name="add" size={24} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Button
              key={tab.id}
              variant={active ? "primary" : "ghost"}
              onPress={() => setActiveTab(tab.id)}
              style={{ ...styles.tabButton, ...(active ? styles.activeTabButton : {}) }}
              textStyle={{ ...styles.tabText, ...(active ? styles.activeTabText : {}) }}
            >
              {tab.label}
            </Button>
          );
        })}
      </View>

      {activeTab === "contact" ? (
        <ContactContent society={society} />
      ) : (
        <TicketsContent />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
    padding: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  tabButton: {
    flex: 1,
    height: 40,
    borderRadius: theme.radius.full,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FilterTabs from "@/components/ui/filter-tabs";

export interface Ticket {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  imageUrl: string;
  updates: { date: string; time: string; message: string }[];
  documents?: { name: string; size: string; uri?: string }[];
}

// We can export and reuse MOCK_TICKETS so other screens like details can access it
export const MOCK_TICKETS: Ticket[] = [
  {
    id: "TK1234",
    title: "Lift Not Working",
    category: "Maintenance",
    date: "15 May 2024",
    description: "The main elevator in Block B is making a grinding noise and stopping halfway. Please inspect it.",
    status: "open",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=300&auto=format&fit=crop",
    updates: [
      { date: "15 May 2024", time: "11:20 AM", message: "Ticket raised successfully." },
    ],
    documents: [
      { name: "Lift_Inspection_Spec.pdf", size: "1.2 MB" },
    ],
  },
  {
    id: "TK1235",
    title: "Water Leakage",
    category: "Plumbing",
    date: "14 May 2024",
    description: "There is a leakage in the bathroom near the shower area.",
    status: "in_progress",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop",
    updates: [
      { date: "14 May 2024", time: "10:35 AM", message: "Your ticket has been created." },
      { date: "14 May 2024", time: "11:00 AM", message: "Our team has assigned this ticket to the maintenance staff." },
    ],
    documents: [
      { name: "Plumber_Invoice.pdf", size: "450 KB" },
      { name: "Bathroom_Layout.dwg", size: "3.4 MB" },
    ],
  },
  {
    id: "TK1236",
    title: "Parking Issue",
    category: "Security",
    date: "13 May 2024",
    description: "Someone has parked their car in my designated parking spot (Block A - 402).",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=300&auto=format&fit=crop",
    updates: [
      { date: "13 May 2024", time: "09:00 AM", message: "Ticket raised successfully." },
      { date: "13 May 2024", time: "10:30 AM", message: "Security guard informed and vehicle moved." },
      { date: "13 May 2024", time: "11:00 AM", message: "Ticket marked as resolved." },
    ],
  },
];

const FILTER_TABS = [
  { id: "my_tickets", label: "My Tickets" },
  { id: "all_tickets", label: "All Tickets" },
];

export default function HelpdeskScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my_tickets");

  const getStatusVariant = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "warning";
      case "in_progress":
        return "info";
      case "resolved":
        return "success";
      default:
        return "primary";
    }
  };

  const getStatusLabel = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Helpdesk"
        onBack={() => router.push(Routes.Root)}
      />

      <View style={styles.tabContainer}>
        {FILTER_TABS.map((tab) => {
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

      <FlatList
        data={MOCK_TICKETS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            variant="flat"
            style={styles.card}
            onPress={() => router.push(Routes.Helpdesk.Details(item.id))}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Badge variant={getStatusVariant(item.status)}>
                  {getStatusLabel(item.status)}
                </Badge>
              </View>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.bottomContainer}>
        <Button
          variant="primary"
          style={styles.raiseButton}
          onPress={() => router.push(Routes.Helpdesk.Create)}
        >
          + Raise New Ticket
        </Button>
      </View>
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
    marginTop: theme.spacing.sm
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
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    alignItems: "center",
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  cardContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  cardDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  separator: {
    height: theme.spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  raiseButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

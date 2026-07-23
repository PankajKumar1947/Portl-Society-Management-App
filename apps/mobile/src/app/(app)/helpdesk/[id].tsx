import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import { MOCK_TICKETS, Ticket } from "./index";

export default function TicketDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const ticket = MOCK_TICKETS.find((t) => t.id === id);

  if (!ticket) {
    return <NotFoundScreen title="Ticket Details" message="Ticket not found" onBack={() => router.back()} />;
  }

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
        title={`Ticket ID #${ticket.id}`}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{ticket.title}</Text>
        <View style={styles.statusRow}>
          <Badge variant={getStatusVariant(ticket.status)}>
            {getStatusLabel(ticket.status)}
          </Badge>
          <Text style={styles.dateSub}>Reported on {ticket.date}, 10:30 AM</Text>
        </View>

        <Text style={styles.description}>{ticket.description}</Text>

        <View style={styles.imageRow}>
          {/* We display a series of images (using ticket.imageUrl or related placeholder images) */}
          <Image source={{ uri: ticket.imageUrl }} style={styles.galleryImage} />
          <Image source={{ uri: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop" }} style={styles.galleryImage} />
          <Image source={{ uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop" }} style={styles.galleryImage} />
        </View>

        {ticket.documents && ticket.documents.length > 0 && (
          <View style={styles.documentsSection}>
            <Text style={styles.sectionLabel}>Attached Documents</Text>
            {ticket.documents.map((doc, index) => (
              <Card key={index} variant="flat" style={styles.fileRow}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="document-text-outline" size={20} color={theme.colors.primaryDark} />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={styles.fileSize}>{doc.size}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.updatesHeader}>
          <Ionicons name="headset-outline" size={20} color={theme.colors.text} style={styles.updatesIcon} />
          <Text style={styles.updatesTitle}>Updates</Text>
        </View>

        <View style={styles.timelineContainer}>
          {ticket.updates.map((update, index) => {
            const isLast = index === ticket.updates.length - 1;
            return (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, isLast && styles.activeDot]} />
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={styles.timelineTime}>
                    {update.date} • {update.time}
                  </Text>
                  <Text style={styles.timelineMessage}>{update.message}</Text>
                </View>
              </View>
            );
          })}
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
  },
  title: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  dateSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  imageRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  galleryImage: {
    flex: 1,
    height: 96,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  updatesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  updatesIcon: {
    marginRight: theme.spacing.xs,
  },
  updatesTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  timelineContainer: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: "row",
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
    marginTop: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: theme.spacing.md,
  },
  timelineTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  timelineMessage: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  documentsSection: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  fileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 0,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  fileSize: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
});

import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { useGetHelpdeskTicketDetail, useResolveHelpdeskTicket, useAccessControl } from "@repo/operations";
import { AclResource } from "@repo/schema";
import ScreenHeader from "@/components/ui/screen-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import LoadingScreen from "@/components/layout/loading-screen";
import { NotFoundScreen } from "@/components/layout/not-found-screen";
import {
  TICKET_STATUS_LABEL,
  TICKET_STATUS_VARIANT,
  TICKET_CATEGORY_LABEL,
  TicketStatus,
} from "@repo/schema";

export default function TicketDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [resolveModalVisible, setResolveModalVisible] = useState(false);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const { data: ticket, isLoading } = useGetHelpdeskTicketDetail(id || "", {
    enabled: !!id,
  });
  const { mutate: resolveTicket, isPending: isResolving } = useResolveHelpdeskTicket(id || "");
  const { canUpdate } = useAccessControl(AclResource.HELPDESK_TICKETS);

  const canResolve = ticket && ticket.status !== "RESOLVED" && ticket.status !== "REJECTED";

  const handleResolve = () => {
    setResolveModalVisible(false);
    resolveTicket();
  };

  if (isLoading) {
    return <LoadingScreen title="Ticket Details" onBack={() => router.back()} />;
  }

  if (!ticket) {
    return (
      <NotFoundScreen
        title="Ticket Details"
        message="Ticket not found"
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={`Ticket #${ticket.ticketId.slice(0, 8).toUpperCase()}`}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{ticket.subject}</Text>
        <View style={styles.statusRow}>
          <Badge variant={TICKET_STATUS_VARIANT[ticket.status as TicketStatus] || "warning"}>
            {TICKET_STATUS_LABEL[ticket.status as TicketStatus] || ticket.status}
          </Badge>
          <Badge variant="primary">
            {TICKET_CATEGORY_LABEL[ticket.category] || ticket.category}
          </Badge>
          {ticket.createdAt && (
            <Text style={styles.dateSub}>
              {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          )}
        </View>

        <Text style={styles.description}>{ticket.description}</Text>

        <View style={styles.divider} />

        <View style={styles.updatesHeader}>
          <Ionicons name="headset-outline" size={20} color={theme.colors.text} style={styles.updatesIcon} />
          <Text style={styles.updatesTitle}>Updates</Text>
        </View>

        {ticket.timeline && ticket.timeline.length > 0 ? (
          <View style={styles.timelineContainer}>
            {ticket.timeline.map((update, index) => {
              const isLast = index === ticket.timeline.length - 1;
              return (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, isLast && styles.activeDot]} />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineRight}>
                    {update.createdAt && (
                      <Text style={styles.timelineTime}>
                        {new Date(update.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    )}
                    <Text style={styles.timelineTitle}>{update.title}</Text>
                    <Text style={styles.timelineMessage}>{update.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noUpdates}>No updates yet</Text>
        )}

        {canResolve && canUpdate && (
          <View style={styles.resolveSection}>
            <Button
              variant="primary"
              style={styles.resolveButton}
              onPress={() => setResolveModalVisible(true)}
              disabled={isResolving}
            >
              {isResolving ? "Resolving..." : "Mark as Resolved"}
            </Button>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={resolveModalVisible}
        onClose={() => setResolveModalVisible(false)}
        title="Resolve Ticket"
        description="Are you sure you want to mark this ticket as resolved?"
        confirmLabel="Resolve"
        confirmVariant="success"
        onConfirm={handleResolve}
      />
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
    flexWrap: "wrap",
  },
  dateSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
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
  timelineTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  timelineMessage: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  noUpdates: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    paddingVertical: 24,
  },
  resolveSection: {
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.section,
  },
  resolveButton: {
    width: "100%",
    height: 52,
  },
});

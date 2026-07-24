import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Modal } from "@/components/ui/modal";
import FormInput from "@/components/ui/form-input";
import FormTextArea from "@/components/ui/form-textarea";
import { COMPLAINT_STATUS, ComplaintStatus, AclResource } from "@repo/schema";
import { useAccessControl } from "@repo/operations";

const STATUS_OPTIONS = [
  {
    status: COMPLAINT_STATUS.IN_PROGRESS,
    label: "In Progress",
    icon: "time-outline" as const,
    color: theme.colors.info,
    description: "Mark as currently being worked on",
  },
  {
    status: COMPLAINT_STATUS.RESOLVED,
    label: "Resolved",
    icon: "checkmark-circle-outline" as const,
    color: theme.colors.success,
    description: "Mark as resolved and closed",
  },
  {
    status: COMPLAINT_STATUS.REJECTED,
    label: "Rejected",
    icon: "close-circle-outline" as const,
    color: theme.colors.danger,
    description: "Reject the complaint",
  },
];

interface ComplaintAdminActionsProps {
  currentStatus: string;
  isUpdating: boolean;
  onStatusUpdate: (status: ComplaintStatus) => Promise<void>;
  onAddTimeline: (title: string, description: string) => Promise<void>;
}

interface TimelineFormValues {
  title: string;
  description: string;
}

export default function ComplaintAdminActions({
  currentStatus,
  isUpdating,
  onStatusUpdate,
  onAddTimeline,
}: ComplaintAdminActionsProps) {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [timelineModalVisible, setTimelineModalVisible] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<ComplaintStatus | null>(null);
  const methods = useForm<TimelineFormValues>({
    defaultValues: { title: "", description: "" },
  });

  const handleAddTimeline = async (values: TimelineFormValues) => {
    if (!values.title.trim() || !values.description.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    await onAddTimeline(values.title.trim(), values.description.trim());
    setTimelineModalVisible(false);
    methods.reset();
  };

  const handleRejectConfirm = async (values: TimelineFormValues) => {
    if (!values.description.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }
    await onStatusUpdate(COMPLAINT_STATUS.REJECTED);
    await onAddTimeline("Complaint Rejected", values.description.trim());
    setRejectTarget(null);
    methods.reset();
  };

  const handleStatusSelect = (newStatus: ComplaintStatus) => {
    setStatusModalVisible(false);
    if (newStatus === COMPLAINT_STATUS.REJECTED) {
      methods.reset({ title: "", description: "" });
      setRejectTarget(newStatus);
    } else {
      onStatusUpdate(newStatus);
    }
  };

  const { canUpdate } = useAccessControl(AclResource.COMPLAINTS);

  if (currentStatus === COMPLAINT_STATUS.RESOLVED || currentStatus === COMPLAINT_STATUS.REJECTED) {
    return null;
  }

  if (!canUpdate) {
    return null;
  }

  const availableOptions = STATUS_OPTIONS.filter((o) => o.status !== currentStatus);

  return (
    <>
      <View style={styles.wrapper}>
        <Text style={styles.sectionTitle}>Manage Complaint</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setStatusModalVisible(true)}
          disabled={isUpdating}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Change Status</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            methods.reset();
            setTimelineModalVisible(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Add Timeline Entry</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <RNModal
        transparent
        visible={statusModalVisible}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.statusModal}>
                <Text style={styles.statusModalTitle}>Change Status</Text>
                <Text style={styles.statusModalSubtitle}>Select a new status for this complaint</Text>

                {availableOptions.map((option) => (
                  <TouchableOpacity
                    key={option.status}
                    style={styles.statusOption}
                    onPress={() => handleStatusSelect(option.status)}
                  >
                    <View style={[styles.statusIcon, { backgroundColor: option.color + "20" }]}>
                      <Ionicons name={option.icon} size={22} color={option.color} />
                    </View>
                    <View style={styles.statusInfo}>
                      <Text style={styles.statusLabel}>{option.label}</Text>
                      <Text style={styles.statusDescription}>{option.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setStatusModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </RNModal>

      <Modal
        visible={timelineModalVisible}
        onClose={() => setTimelineModalVisible(false)}
        title="Add Timeline Entry"
        description="Add an update to the complaint timeline"
        confirmLabel="Add Entry"
        onConfirm={methods.handleSubmit(handleAddTimeline)}
      >
        <FormProvider {...methods}>
          <FormInput
            name="title"
            label="Title"
            placeholder="e.g. Under Review"
          />
          <FormTextArea
            name="description"
            label="Description"
            placeholder="Describe the update..."
          />
        </FormProvider>
      </Modal>

      <Modal
        visible={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Complaint"
        description="Please provide a reason for rejecting this complaint."
        confirmLabel="Reject"
        confirmVariant="danger"
        onConfirm={methods.handleSubmit(handleRejectConfirm)}
      >
        <FormProvider {...methods}>
          <FormTextArea
            name="description"
            label="Rejection Reason"
            placeholder="Explain why this complaint is being rejected..."
          />
        </FormProvider>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    height: 48,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  statusModal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  statusModalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusModalSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
});

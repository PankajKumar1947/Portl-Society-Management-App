import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import { theme } from "../../constants";
import { Button } from "./button";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: "primary" | "secondary" | "danger" | "success";
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmVariant = "primary",
  children,
  containerStyle,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, containerStyle]}>
              <Text style={styles.title}>{title}</Text>
              
              {description ? (
                <Text style={styles.description}>{description}</Text>
              ) : null}

              {children ? <View style={styles.content}>{children}</View> : null}

              <View style={styles.actionRow}>
                <Button
                  variant="outline"
                  onPress={onClose}
                  style={styles.actionBtn}
                >
                  {cancelLabel}
                </Button>
                {onConfirm ? (
                  <Button
                    variant={confirmVariant === "danger" ? "outline" : "primary"}
                    onPress={onConfirm}
                    style={{
                      flex: 1,
                      height: 48,
                      ...(confirmVariant === "danger" ? { borderColor: theme.colors.danger } : {}),
                    }}
                    textStyle={
                      confirmVariant === "danger"
                        ? { color: theme.colors.danger }
                        : undefined
                    }
                  >
                    {confirmLabel}
                  </Button>
                ) : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    height: 48,
  },
  dangerBorder: {
    borderColor: theme.colors.danger,
  },
});

export default Modal;

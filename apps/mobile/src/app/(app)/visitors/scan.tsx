import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useScanPassCode } from "@repo/operations";
import { SCAN_DIRECTION, VISITOR_STATUS, VISITOR_TYPE, ScanDirection } from "@repo/schema";

type ScanMode = "camera" | "manual";

export default function ScanScreen() {
  const router = useRouter();
  const { dir } = useLocalSearchParams<{ dir?: string }>();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [direction, setDirection] = useState<ScanDirection>(
    dir === "exit" ? SCAN_DIRECTION.EXIT : SCAN_DIRECTION.ENTRY
  );
  const [showDirectionModal, setShowDirectionModal] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    type: string;
    status: string;
    logId: string;
    action: string;
  } | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { mutate: scanPass, isPending } = useScanPassCode();
  const lastScanned = useRef("");

  useEffect(() => {
    if (dir === "exit") {
      setDirection(SCAN_DIRECTION.EXIT);
    } else if (dir === "entry") {
      setDirection(SCAN_DIRECTION.ENTRY);
    }
  }, [dir]);

  const handleScan = useCallback((code: string, dir: ScanDirection) => {
    if (lastScanned.current === `${dir}:${code}`) return;
    lastScanned.current = `${dir}:${code}`;
    setScanned(true);

    scanPass(
      { passCode: code, type: dir },
      {
        onSuccess: (res) => {
          setResult({
            name: res.data?.name || "Visitor",
            type: res.data?.type || VISITOR_TYPE.GUEST,
            status: res.data?.status || VISITOR_STATUS.APPROVED,
            logId: res.data?.logId || "",
            action: dir,
          });
        },
        onError: () => {
          setTimeout(() => {
            setScanned(false);
            lastScanned.current = "";
          }, 2000);
        },
      },
    );
  }, [scanPass]);

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (!code) return;
    handleScan(code, direction);
  };

  const handleReset = () => {
    setScanned(false);
    setResult(null);
    lastScanned.current = "";
    setManualCode("");
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Scan Pass" showBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Scan Pass" showBack />
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={64} color={theme.colors.textMuted} />
          <Text style={styles.permissionText}>Camera access is required to scan QR codes</Text>
          <Button onPress={requestPermission} style={styles.permissionBtn}>
            Grant Permission
          </Button>
          <TouchableOpacity onPress={() => setMode("manual")} style={styles.switchModeBtn}>
            <Text style={styles.switchModeText}>Or enter pass code manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (result) {
    const isPending = result.status === "pending";

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Scan Result" showBack onBack={handleReset} />
        <View style={styles.center}>
          <Ionicons
            name={
              isPending
                ? "time-outline"
                : result.action === SCAN_DIRECTION.ENTRY
                ? "enter-outline"
                : "exit-outline"
            }
            size={72}
            color={
              isPending
                ? theme.colors.warning
                : result.action === SCAN_DIRECTION.ENTRY
                ? theme.colors.success
                : theme.colors.warning
            }
          />
          <Text style={styles.resultAction}>
            {isPending
              ? "APPROVAL REQUEST SENT"
              : `${result.action === SCAN_DIRECTION.ENTRY ? "ENTRY" : "EXIT"} LOGGED`}
          </Text>
          <Card variant="flat" style={styles.resultCard}>
            <Text style={styles.resultName}>{result.name}</Text>
            <Text style={styles.resultType}>{result.type.toUpperCase()}</Text>
            <Badge variant={isPending ? "warning" : "success"} style={styles.resultBadge}>
              {result.status}
            </Badge>
          </Card>
          <View style={styles.resultActions}>
            <View style={styles.secondaryActionsRow}>
              <Button variant="outline" onPress={handleReset} style={styles.secondaryResultBtn}>
                Scan Another
              </Button>
              <Button
                variant="outline"
                onPress={() => router.replace(Routes.Visitors.Index)}
                style={styles.secondaryResultBtn}
              >
                Go to Visitors
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Scan Pass"
        showBack
        rightElement={
          <TouchableOpacity
            onPress={() => setMode(mode === "camera" ? "manual" : "camera")}
            style={styles.headerToggle}
          >
            <Ionicons
              name={mode === "camera" ? "keypad-outline" : "camera-outline"}
              size={22}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        <View style={styles.scanModeHeader}>
          <Text style={styles.scanModeHeaderText}>
            Scanning for <Text style={direction === SCAN_DIRECTION.ENTRY ? styles.modeTextEntry : styles.modeTextExit}>{direction === SCAN_DIRECTION.ENTRY ? "Entry" : "Exit"}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowDirectionModal(true)}
            style={styles.changeModeBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.changeModeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {mode === "camera" ? (
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={
                scanned
                  ? undefined
                  : (scanResult) => handleScan(scanResult.data, direction)
              }
            />
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanHint}>
                {direction === SCAN_DIRECTION.ENTRY
                  ? "Scan QR code for entry"
                  : "Scan QR code for exit"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.manualContainer}>
            <Ionicons name="keypad-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.manualTitle}>Enter Pass Code</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="VP12345678"
              placeholderTextColor={theme.colors.textMuted}
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Button
              onPress={handleManualSubmit}
              style={styles.submitBtn}
              loading={isPending}
              disabled={!manualCode.trim()}
            >
              {direction === SCAN_DIRECTION.ENTRY ? "Verify Entry" : "Verify Exit"}
            </Button>
          </View>
        )}

        {scanned && isPending && (
          <View style={styles.scanningOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.scanningText}>Verifying...</Text>
          </View>
        )}

        <Modal
          visible={showDirectionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDirectionModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDirectionModal(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Scan Mode</Text>
                <TouchableOpacity onPress={() => setShowDirectionModal(false)}>
                  <Ionicons name="close-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubTitle}>Choose scan direction:</Text>
              <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
                <TouchableOpacity
                  style={styles.scanModeOption}
                  onPress={() => {
                    setDirection(SCAN_DIRECTION.ENTRY);
                    setShowDirectionModal(false);
                  }}
                >
                  <Ionicons name="enter-outline" size={22} color={theme.colors.success} />
                  <Text style={styles.scanModeOptionText}>Scan for Entry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.scanModeOption}
                  onPress={() => {
                    setDirection(SCAN_DIRECTION.EXIT);
                    setShowDirectionModal(false);
                  }}
                >
                  <Ionicons name="exit-outline" size={22} color={theme.colors.warning} />
                  <Text style={styles.scanModeOptionText}>Scan for Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  headerToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  scanModeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scanModeHeaderText: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  modeTextEntry: {
    color: theme.colors.success,
    fontWeight: theme.fontWeights.bold,
  },
  modeTextExit: {
    color: theme.colors.warning,
    fontWeight: theme.fontWeights.bold,
  },
  changeModeBtn: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  changeModeText: {
    fontSize: 13,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  modalSubTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  scanModeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
    gap: theme.spacing.sm,
  },
  scanModeOptionText: {
    fontSize: 15,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    backgroundColor: "transparent",
  },
  scanHint: {
    position: "absolute",
    bottom: 100,
    color: "#fff",
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
  },
  manualContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  manualTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  codeInput: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    textAlign: "center",
    letterSpacing: 2,
  },
  submitBtn: {
    width: "100%",
    height: 52,
  },
  scanningOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  scanningText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
  },
  permissionText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  permissionBtn: {
    width: "100%",
    height: 52,
  },
  switchModeBtn: {
    padding: theme.spacing.md,
  },
  switchModeText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.semibold,
  },
  resultAction: {
    fontSize: 20,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
    letterSpacing: 2,
  },
  resultCard: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  resultName: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  resultType: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  resultBadge: {
    marginTop: theme.spacing.xs,
  },
  resultActions: {
    gap: theme.spacing.sm,
    width: "100%",
    marginTop: theme.spacing.md,
  },
  primaryResultBtn: {
    width: "100%",
    height: 50,
  },
  secondaryActionsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    width: "100%",
  },
  secondaryResultBtn: {
    flex: 1,
    height: 50,
  },
});

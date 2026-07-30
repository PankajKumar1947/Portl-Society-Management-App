import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "expo-router";
import { useScanPassCode } from "@repo/operations";
import { SCAN_DIRECTION, VISITOR_STATUS, VISITOR_TYPE, ScanDirection } from "@repo/schema";

type ScanMode = "camera" | "manual";

export default function ScanScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [direction, setDirection] = useState<ScanDirection>(SCAN_DIRECTION.ENTRY);
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
            <Button
              onPress={() => router.push(Routes.Visitors.Pass(result.logId))}
              style={styles.primaryResultBtn}
            >
              View Details
            </Button>
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
        <View style={styles.directionSelector}>
          <TouchableOpacity
            style={[
              styles.directionBtn,
              direction === SCAN_DIRECTION.ENTRY && styles.directionActive,
            ]}
            onPress={() => setDirection(SCAN_DIRECTION.ENTRY)}
          >
            <Ionicons
              name="enter-outline"
              size={20}
              color={direction === SCAN_DIRECTION.ENTRY ? "#fff" : theme.colors.success}
            />
            <Text
              style={[
                styles.directionText,
                direction === SCAN_DIRECTION.ENTRY && styles.directionTextActive,
              ]}
            >
              Entry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.directionBtn,
              direction === SCAN_DIRECTION.EXIT && styles.directionExitActive,
            ]}
            onPress={() => setDirection(SCAN_DIRECTION.EXIT)}
          >
            <Ionicons
              name="exit-outline"
              size={20}
              color={direction === SCAN_DIRECTION.EXIT ? "#fff" : theme.colors.warning}
            />
            <Text
              style={[
                styles.directionText,
                direction === SCAN_DIRECTION.EXIT && styles.directionTextActive,
              ]}
            >
              Exit
            </Text>
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
  directionSelector: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  directionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  directionActive: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  directionExitActive: {
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning,
  },
  directionText: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  directionTextActive: {
    color: "#fff",
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

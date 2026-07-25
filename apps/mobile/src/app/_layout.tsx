import { Stack } from "expo-router";
import { AuthProvider } from "../context/auth-context";
import { AlertProvider } from "../context/alert-context";
import { StatusBar } from "expo-status-bar";
import { ReactQueryProvider, AccessControlProvider } from "@repo/operations";
import { theme } from "../constants";
import { useNotificationObserver } from "../utils/notifications";

function NotificationSetup() {
  useNotificationObserver();
  return null;
}

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AlertProvider>
          <AccessControlProvider>
            <StatusBar style="dark" backgroundColor={theme.colors.background} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }} />
            <NotificationSetup />
          </AccessControlProvider>
        </AlertProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

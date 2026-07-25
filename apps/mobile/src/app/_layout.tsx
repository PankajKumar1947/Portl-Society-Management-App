import { Stack } from "expo-router";
import { AuthProvider } from "../context/auth-context";
import { AlertProvider } from "../context/alert-context";
import { StatusBar } from "expo-status-bar";
import { ReactQueryProvider, AccessControlProvider } from "@repo/operations";
import { theme } from "../constants";

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AlertProvider>
          <AccessControlProvider>
            <StatusBar style="dark" backgroundColor={theme.colors.background} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.surface } }} />
          </AccessControlProvider>
        </AlertProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

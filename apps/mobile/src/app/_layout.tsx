import { Stack } from "expo-router";
import { RoleProvider } from "../context/role-context";
import { AuthProvider } from "../context/auth-context";
import { AlertProvider } from "../context/alert-context";
import { StatusBar } from "expo-status-bar";
import { ReactQueryProvider } from "@repo/operations";
import { theme } from "../constants";

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <RoleProvider>
          <AlertProvider>
            <StatusBar style="dark" backgroundColor={theme.colors.background} />
            <Stack screenOptions={{ headerShown: false }} />
          </AlertProvider>
        </RoleProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

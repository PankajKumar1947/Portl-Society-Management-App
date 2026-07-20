import { Stack } from "expo-router";
import { RoleProvider } from "../context/role-context";
import { AuthProvider } from "../context/auth-context";
import { StatusBar } from "expo-status-bar";
import { ReactQueryProvider } from "@repo/operations";

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <RoleProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </RoleProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

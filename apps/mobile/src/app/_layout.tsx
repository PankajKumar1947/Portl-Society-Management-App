import { Stack } from "expo-router";
import { RoleProvider } from "../context/role-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <RoleProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </RoleProvider>
  );
}

import { Redirect, Href } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/constants";
import { Routes } from "@/constants/routes";

export default function Index() {
  const { isAuthenticated, isSocietyCreated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={Routes.Onboarding.Index as Href} />;
  }

  if (!isSocietyCreated) {
    return <Redirect href={Routes.Onboarding.SetupSociety as Href} />;
  }

  return <Redirect href="/(app)" />;
}

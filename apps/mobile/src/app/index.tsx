import { Redirect } from "expo-router";
import { useAuth } from "../context/auth-context";
import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(app)" />;
}

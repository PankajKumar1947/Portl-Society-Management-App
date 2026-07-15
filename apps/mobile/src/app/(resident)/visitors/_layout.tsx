import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../constants";

export default function VisitorsLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

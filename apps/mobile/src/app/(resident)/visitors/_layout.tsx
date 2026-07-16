import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../constants";

export default function VisitorsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

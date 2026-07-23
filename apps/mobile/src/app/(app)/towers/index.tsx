import { StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import IconButton from "@/components/ui/icon-button";
import TowerCard from "./_components/tower-card";
import LoadingScreen from "@/components/layout/loading-screen";
import { useGetTowers } from "@repo/operations";

export default function TowersListScreen() {
  const router = useRouter();

  const { data: towers, isLoading: isTowersLoading } = useGetTowers();

  const isLoading = isTowersLoading;
  if (isLoading) return <LoadingScreen title="Towers" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Towers & Apartments"
        onBack={() => router.replace(Routes.Root)}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Towers.Create)}
            icon={<Ionicons name="add" size={22} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

        <FlatList
          data={towers || []}
          keyExtractor={(item) => item.towerId}
          renderItem={({ item }) => (
            <TowerCard
              item={item}
              onPress={() => router.push(Routes.Towers.Details(item.towerId))}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
});

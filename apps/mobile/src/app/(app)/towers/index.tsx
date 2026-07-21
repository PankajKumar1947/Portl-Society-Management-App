import { StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import IconButton from "@/components/ui/icon-button";
import TowerCard, { TowerItem } from "./_components/tower-card";

const MOCK_TOWERS: TowerItem[] = [
  {
    id: "tow_1",
    towerName: "Tower A (Sunflower)",
    location: "North Block, Gate 1",
    appNumber: "TWR-A101",
    flatsCount: 24,
  },
  {
    id: "tow_2",
    towerName: "Tower B (Daffodil)",
    location: "South Block, Near Garden",
    appNumber: "TWR-B102",
    flatsCount: 36,
  },
  {
    id: "tow_3",
    towerName: "Tower C (Orchid)",
    location: "East Block, Clubhouse Side",
    appNumber: "TWR-C103",
    flatsCount: 18,
  },
];

export default function TowersListScreen() {
  const router = useRouter();

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
        data={MOCK_TOWERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TowerCard
            item={item}
            onPress={() => router.push(Routes.Towers.Details(item.id))}
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

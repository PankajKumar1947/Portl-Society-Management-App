import { useLayoutEffect } from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import InfoRow from "@/components/ui/info-row";
import IconButton from "@/components/ui/icon-button";
import FlatCard, { FlatItem } from "./[id]/flats/_components/flat-card";

const MOCK_FLATS: FlatItem[] = [
  {
    id: "flt_101",
    flatNumber: "101",
    floorNumber: 1,
    rooms: 3,
    bathrooms: 2,
    status: "OCCUPIED",
    residentsCount: 4,
  },
  {
    id: "flt_102",
    flatNumber: "102",
    floorNumber: 1,
    rooms: 2,
    bathrooms: 2,
    status: "VACANT",
    residentsCount: 0,
  },
  {
    id: "flt_201",
    flatNumber: "201",
    floorNumber: 2,
    rooms: 3,
    bathrooms: 3,
    status: "OCCUPIED",
    residentsCount: 3,
  },
];

export default function TowerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Tower Details"
        onBack={() => router.back()}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Towers.Edit(id as string))}
            icon={<Ionicons name="pencil-outline" size={20} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

      <FlatList
        data={MOCK_FLATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FlatCard
            item={item}
            onPress={() => router.push(Routes.Towers.Flats.Details(id as string, item.id))}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Card variant="flat" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tower A (Sunflower)</Text>
            <InfoRow icon="location-outline" label="Location" value="North Block, Gate 1" />
            <InfoRow icon="key-outline" label="App Reg No" value="TWR-A101" />
            <InfoRow icon="home-outline" label="Total Units" value="24 Flats" />
          </Card>
        }
      />

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => router.push(Routes.Towers.Flats.Create(id as string))}
      >
        <Ionicons name="add" size={24} color={theme.colors.surface} />
        <Text style={styles.fabText}>Add Flat</Text>
      </TouchableOpacity>
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
  summaryCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: theme.spacing.xs,
  },
  fabText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
  },
});

import { useLayoutEffect } from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import InfoRow from "@/components/ui/info-row";
import IconButton from "@/components/ui/icon-button";
import FlatCard from "./_components/flat-card";
import { useGetTowerDetails, useGetFlats } from "@repo/operations";

export default function TowerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: tower, isLoading: isTowerLoading } = useGetTowerDetails(id || "", { enabled: !!id });
  const { data: flats, isLoading: isFlatsLoading } = useGetFlats(id || "", { enabled: !!id });

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const isLoading = isTowerLoading || isFlatsLoading;

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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={flats || []}
          keyExtractor={(item) => item.flatId}
          renderItem={({ item }) => (
            <FlatCard
              item={item}
              onPress={() => router.push(Routes.Towers.Flats.Details(id as string, item.flatId))}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Card variant="flat" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{tower?.towerName || "Tower Details"}</Text>
              <InfoRow icon="location-outline" label="Location" value={tower?.location || "N/A"} />
              <InfoRow icon="key-outline" label="App Reg No" value={tower?.appNumber || "N/A"} />
              <InfoRow icon="home-outline" label="Total Units" value={`${flats?.length || 0} Flats`} />
            </Card>
          }
        />
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

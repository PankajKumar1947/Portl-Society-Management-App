import { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import InfoRow from "@/components/ui/info-row";
import IconButton from "@/components/ui/icon-button";
import ResidentCard, { Resident } from "./_components/resident-card";
import LoadingScreen from "@/components/layout/loading-screen";
import { useGetFlatDetails, useGetTowerDetails } from "@repo/operations";

const MOCK_RESIDENTS: Resident[] = [
  {
    id: "res_1",
    name: "Sunita Sharma",
    role: "Owner",
    phone: "+91 98765 43210",
    isPrimary: true,
  },
  {
    id: "res_2",
    name: "Rahul Sharma",
    role: "Family Member",
    phone: "+91 98765 43211",
    isPrimary: false,
  },
];

export default function FlatDetailsScreen() {
  const { id, flatId } = useLocalSearchParams<{ id: string; flatId: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: flat, isLoading: isFlatLoading } = useGetFlatDetails(flatId || "", { enabled: !!flatId });
  const { data: tower, isLoading: isTowerLoading } = useGetTowerDetails(id || "", { enabled: !!id });

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const isLoading = isFlatLoading || isTowerLoading;
  if (isLoading) return <LoadingScreen title="Flat Details" />;

  const getStatusVariant = (status?: string): "success" | "warning" | "danger" => {
    if (status === "OCCUPIED") return "success";
    if (status === "VACANT") return "warning";
    return "danger";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Flat Details"
        onBack={() => router.back()}
        rightElement={
          <IconButton
            onPress={() => router.push(Routes.Towers.Flats.Edit(id as string, flatId as string))}
            icon={<Ionicons name="pencil-outline" size={20} color={theme.colors.text} />}
            variant="ghost"
            size="md"
          />
        }
      />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Flat Summary Banner */}
          <Card variant="flat" style={styles.headerCard}>
            <View style={styles.iconWrapper}>
              <Ionicons name="home-outline" size={32} color={theme.colors.primaryDark} />
            </View>
            <Text style={styles.flatTitle}>Flat {flat?.flatNumber}</Text>
            <Text style={styles.towerText}>{tower?.towerName || "Tower Details"}</Text>
            <Badge variant={getStatusVariant(flat?.status)} style={styles.statusBadge}>
              {flat?.status || "VACANT"}
            </Badge>
          </Card>

          {/* Structural Specifications */}
          <Card variant="flat" style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Flat Specifications</Text>
            <InfoRow icon="bed-outline" label="Bedrooms" value={`${flat?.numberOfRooms || 0} Rooms`} />
            <InfoRow icon="water-outline" label="Bathrooms" value={`${flat?.numberOfBathrooms || 0} Bathrooms`} />
            <InfoRow icon="restaurant-outline" label="Kitchen" value={`${flat?.kitchen || 0} Kitchen`} />
            <InfoRow icon="film-outline" label="Balconies" value={`${flat?.balcony || 0} Balconies`} />
            <InfoRow icon="tv-outline" label="Living / Hall Room" value={`${flat?.hallRoom || 0} Hall Room`} />
          </Card>

          {/* Residents List Card */}
          <Card variant="flat" style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>Residents & Members</Text>
              <IconButton
                onPress={() => {}}
                icon={<Ionicons name="add-circle-outline" size={22} color={theme.colors.primaryDark} />}
                variant="ghost"
                size="sm"
              />
            </View>

            {MOCK_RESIDENTS.map((resident) => (
              <ResidentCard key={resident.id} resident={resident} />
            ))}
          </Card>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  headerCard: {
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  flatTitle: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  towerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
});

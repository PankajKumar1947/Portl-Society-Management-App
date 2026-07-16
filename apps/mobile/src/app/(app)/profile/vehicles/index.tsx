import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Routes } from "@/constants";

interface Vehicle {
  id: string;
  type: string;
  number: string;
  model: string;
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: "1", type: "Car (Sedan)", number: "MH 12 AB 1234", model: "Honda City" },
  { id: "2", type: "Car (SUV)", number: "MH 12 CD 5678", model: "Hyundai Creta" },
];

export default function VehiclesScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Vehicle Details" onBack={() => router.back()} />

      <FlatList
        data={MOCK_VEHICLES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card variant="flat" style={styles.vehicleCard}>
            <View style={styles.iconWrapper}>
              <Ionicons name="car-sport-outline" size={24} color={theme.colors.primaryDark} />
            </View>
            <View style={styles.infoWrapper}>
              <Text style={styles.number}>{item.number}</Text>
              <Text style={styles.typeModel}>
                {item.type} • {item.model}
              </Text>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.bottomContainer}>
        <Button
          variant="outline"
          style={styles.addButton}
          textStyle={styles.addButtonText}
          onPress={() => router.push(Routes.Profile.AddVehicle)}
        >
          Add Vehicle
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  infoWrapper: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  number: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  typeModel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: theme.spacing.sm,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  addButton: {
    width: "100%",
    height: 52,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  addButtonText: {
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeights.bold,
  },
});

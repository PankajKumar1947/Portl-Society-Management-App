import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import PersonListItem from "@/components/ui/person-list-item";
import { Ionicons } from "@expo/vector-icons";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  isHead: boolean;
  avatar: string;
}

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    name: "Sunita Sharma",
    relationship: "Me",
    isHead: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120",
  },
  {
    id: "2",
    name: "Rohit Sharma",
    relationship: "Spouse",
    isHead: false,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
  },
  {
    id: "3",
    name: "Ananya Sharma",
    relationship: "Daughter",
    isHead: false,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
  },
];

export default function MyFamilyScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [members] = useState<FamilyMember[]>(INITIAL_MEMBERS);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Family" onBack={() => router.back()} />

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PersonListItem
            name={item.name}
            subtitle={item.relationship}
            imageUrl={item.avatar}
            style={styles.memberCard}
            onPress={() => router.push({
              pathname: Routes.Profile.AddFamily,
              params: {
                id: item.id,
                name: item.name,
                relationship: item.relationship,
                avatar: item.avatar,
              }
            })}
            rightElement={
              item.isHead ? (
                <Badge variant="success">
                  Head of Family
                </Badge>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.bottomContainer}>
        <Button
          variant="outline"
          style={styles.addButton}
          textStyle={styles.addButtonText}
          onPress={() => router.push(Routes.Profile.AddFamily)}
        >
          Add Family Member
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
  memberCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
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

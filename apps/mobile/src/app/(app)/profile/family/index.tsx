import React, { useLayoutEffect, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import PersonListItem from "@/components/ui/person-list-item";
import { Ionicons } from "@expo/vector-icons";
import { useGetFamilyMembers } from "@repo/operations";

const RELATIONSHIP_LABEL: Record<string, string> = {
  SPOUSE: "Spouse",
  SON: "Son",
  DAUGHTER: "Daughter",
  FATHER: "Father",
  MOTHER: "Mother",
  BROTHER: "Brother",
  SISTER: "Sister",
  OTHER: "Other",
};

interface ListItem {
  id: string;
  name: string;
  subtitle: string;
  isHead: boolean;
  avatar: string;
}

export default function MyFamilyScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { data: familyMembers, isLoading: loadingFamily, refetch: refetchFamily } = useGetFamilyMembers();

  const loading = loadingFamily;

  const handleRefresh = async () => {
    await refetchFamily();
  };

  const items = useMemo(() => {
    const result: ListItem[] = [];

    if (familyMembers) {
      for (const fm of familyMembers) {
        result.push({
          id: `family_${fm.familyMemberId}`,
          name: `${fm.firstName} ${fm.lastName}`,
          subtitle: RELATIONSHIP_LABEL[fm.relationship] ?? fm.relationship,
          isHead: false,
          avatar: "",
        });
      }
    }

    return result;
  }, [familyMembers]);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (loading && !items.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="My Family" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Family" onBack={() => router.back()} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, items.length === 0 && styles.center]}
        refreshing={loading}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <PersonListItem
            name={item.name}
            subtitle={item.subtitle}
            imageUrl={item.avatar}
            style={styles.memberCard}
            onPress={() => router.push(Routes.Profile.EditFamily(item.id.replace("family_", "")))}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No family members yet</Text>
          </View>
        }
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    fontSize: 15,
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
    bottom: 80,
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

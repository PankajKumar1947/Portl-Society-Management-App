import React from "react";
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import Button from "@/components/ui/button";
import ProfileRow from "@/components/ui/profile-row";
import { useAuth } from "@/context/auth-context";
import { useGetMe, useGetMySociety } from "@repo/operations";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: society } = useGetMySociety();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace(Routes.Auth.Login);
    } catch (error) {
      Alert.alert("Logout Failed", "Failed to log out. Please try again.");
    }
  };

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User Profile"
    : "Sunita Sharma";

  const userSubtext = society?.societyName
    ? `${society.societyName} (${society.societyType?.replace(/_/g, " ")})`
    : user?.email || "Resident";

  const menuItems = [
    {
      id: "family",
      title: "My Family",
      icon: "people-outline" as const,
      badge: "3 Members",
      onPress: () => router.push(Routes.Profile.MyFamily),
    },
    {
      id: "vehicles",
      title: "Vehicle Details",
      icon: "car-outline" as const,
      badge: "2 Vehicles",
      onPress: () => router.push(Routes.Profile.Vehicles),
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings-outline" as const,
      onPress: () => router.push(Routes.Profile.Settings),
    },
    {
      id: "support",
      title: "Support",
      icon: "help-circle-outline" as const,
      onPress: () => router.push(Routes.Profile.Support),
    },
    {
      id: "about",
      title: "About Portl",
      icon: "information-circle-outline" as const,
      onPress: () => router.push(Routes.Profile.About),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Profile" onBack={() => router.replace(Routes.Root)} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.profileCard}
          onPress={() => router.push(Routes.Profile.EditProfile)}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="#FFF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            {isUserLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <>
                <Text style={styles.userName}>{fullName}</Text>
                <Text style={styles.userFlat}>{userSubtext}</Text>
              </>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <ProfileRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
              showBorder={index < menuItems.length - 1}
              rightElement={
                item.badge ? (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : undefined
              }
            />
          ))}
        </View>

        {/* Logout Button */}
        <Button
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutText}
          onPress={handleLogout}
        >
          Logout
        </Button>
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primaryDark,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  userFlat: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  badgeContainer: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    width: "100%",
    height: 52,
    borderColor: theme.colors.danger,
    backgroundColor: "transparent",
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.bold,
  },
});

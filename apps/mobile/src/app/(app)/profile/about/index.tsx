import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { Images } from "@/assets/images";

export default function AboutScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="About Portl" onBack={() => router.back()} />

      <View style={styles.content}>
        {/* Brand Logo & Slogan (Top/Middle Area) */}
        <View style={styles.logoWrapper}>
          <Image
            source={Images.iconFull}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.versionText}>Version 1.0.0</Text>
          
          <View style={styles.infoWrapper}>
            <Text style={styles.infoText}>Your community, one app.</Text>
            <Text style={styles.loveText}>
              Made with <Text style={{ color: theme.colors.danger }}>❤️</Text> for better communities.
            </Text>
          </View>
        </View>

        {/* Thank You & Rate Button (Bottom Area) */}
        <View style={styles.footerWrapper}>
          <Text style={styles.thankYouText}>Thank you for using our app!</Text>
          
          <TouchableOpacity activeOpacity={0.7} style={styles.rateButton}>
            <Ionicons name="star" size={16} color={theme.colors.primaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.rateButtonText}>Rate us on App Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 20,
  },
  logoImage: {
    width: 220,
    height: 220,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 0,
  },
  infoWrapper: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  footerWrapper: {
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  thankYouText: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  infoText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textSecondary,
  },
  loveText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  rateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primaryDark,
  },
});

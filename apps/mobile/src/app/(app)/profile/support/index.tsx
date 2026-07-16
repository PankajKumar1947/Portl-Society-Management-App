import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import ProfileRow from "@/components/ui/profile-row";

export default function SupportScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Support" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>How can we help you?</Text>

        <View style={styles.card}>
          <ProfileRow
            icon="help-circle-outline"
            title="FAQs"
            onPress={() => { }}
          />
          <ProfileRow
            icon="chatbubbles-outline"
            title="Contact Support"
            subtitle="We will get back to you"
            onPress={() => { }}
          />
          <ProfileRow
            icon="bug-outline"
            title="Report an Issue"
            subtitle="Found a bug or have feedback?"
            onPress={() => { }}
          />
          <ProfileRow
            icon="call-outline"
            title="Call Us"
            subtitle="1800 123 4567 (10 AM - 6 PM)"
            showBorder={false}
          />
        </View>
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
  },
  heading: {
    fontSize: 22,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginVertical: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
});

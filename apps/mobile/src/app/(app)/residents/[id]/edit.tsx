import React, { useLayoutEffect } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, View, Text } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import ResidentForm, { ResidentFormValues } from "../_components/resident-form";
import { mockResidents, updateResident } from "../_components/mock-data";

export default function EditResidentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const resident = mockResidents.find((r) => r.id === id);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (!resident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Edit Resident" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Resident not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = (values: ResidentFormValues) => {
    try {
      updateResident(id, values);
      Alert.alert("Success", "Resident updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update resident");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title={`Edit ${resident.firstName}'s Info`} onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ResidentForm
            initialValues={resident}
            onSubmit={handleSubmit}
            submitButtonText="Save Changes"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.medium,
  },
});

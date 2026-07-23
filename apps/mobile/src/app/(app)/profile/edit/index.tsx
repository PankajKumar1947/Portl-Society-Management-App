import React, { useLayoutEffect, useEffect } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, Routes } from "@/constants";
import ScreenHeader from "@/components/ui/screen-header";
import { LoadingScreen } from "@/components/layout/loading-screen";
import Button from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import FormPhone from "@/components/ui/form-phone";
import { UpdateUserBody } from "@repo/schema";
import { useGetMe, useUpdateUser } from "@repo/operations";
import type { ApiErrorResponse } from "@repo/api-client";

export default function EditProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { data: user, isLoading: isFetching } = useGetMe();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(user?.userId || "");

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const methods = useForm<UpdateUserBody>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      methods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
      });
    }
  }, [user, methods]);

  const onSubmit = (values: UpdateUserBody) => {
    updateUser(
      {
        firstName: values.firstName,
        lastName: values.lastName,
      },
      {
        onSuccess: () => {
          router.replace(Routes.Profile.Index);
        },
        onError: (err) => {
          const apiError = err as unknown as ApiErrorResponse;
          Alert.alert("Update Failed", apiError.message || "Failed to update profile");
        },
      }
    );
  };

  if (isFetching) {
    return <LoadingScreen title="Edit Profile" onBack={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Profile" onBack={() => router.replace(Routes.Profile.Index)} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Edit Area */}
          <View style={styles.avatarWrapper}>
            <TouchableOpacity activeOpacity={0.8} style={styles.avatarButton}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200" }}
                style={styles.avatarImage}
              />
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera-outline" size={18} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <FormProvider {...methods}>
            <FormInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              required
            />

            <View style={styles.fieldGap} />

            <FormPhone
              name="phoneNumber"
              label="Mobile Number"
              placeholder="Enter 10-digit phone number"
              editable={false}
              required
            />

            <View style={styles.fieldGap} />

            <FormInput
              name="email"
              label="Email"
              placeholder="email@domain.com"
              keyboardType="email-address"
              editable={false}
              required
            />
          </FormProvider>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={methods.handleSubmit(onSubmit)}
            disabled={isUpdating}
            loading={isUpdating}
          >
            Save Changes
          </Button>
        </View>
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
    paddingBottom: 100,
  },
  avatarWrapper: {
    alignItems: "center",
    marginVertical: theme.spacing.xl,
  },
  avatarButton: {
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primaryDark,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  fieldGap: {
    height: theme.spacing.md,
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
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});

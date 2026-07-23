import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants";
import { ScreenHeader } from "../ui/screen-header";
import { EmptyState } from "./empty-state";

export interface NotFoundScreenProps {
  title: string;
  message: string;
  description?: string;
  icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  onBack?: () => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  title,
  message,
  description,
  icon = "alert-circle-outline",
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={title} onBack={onBack} />
      <EmptyState icon={icon} title={message} description={description} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default NotFoundScreen;

import { View, Text, StyleSheet, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { theme } from "../../constants";
import { IconButton } from "./icon-button";

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  titleStyle?: TextStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBack = true,
  leftElement,
  rightElement,
  titleStyle,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const renderLeft = () => {
    if (leftElement) return leftElement;
    if (showBack) {
      return (
        <IconButton
          onPress={handleBack}
          icon={<Ionicons name="chevron-back" size={24} color={theme.colors.text} />}
          variant="ghost"
          size="md"
        />
      );
    }
    return <View style={styles.spacer} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSlot}>
        {renderLeft()}
      </View>

      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightSlot}>
        {rightElement ?? <View style={styles.spacer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  leftSlot: {
    minWidth: 44,
    alignItems: "flex-start",
  },
  rightSlot: {
    minWidth: 44,
    alignItems: "flex-end",
  },
  spacer: {
    width: 44,
  },
});

export default ScreenHeader;

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants";

export interface FabProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  style?: ViewStyle;
}

export const Fab: React.FC<FabProps> = ({
  onPress,
  icon = "add",
  label,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.base,
        label ? styles.extended : styles.compact,
        style,
      ]}
    >
      <Ionicons name={icon} size={22} color={theme.colors.text} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </TouchableOpacity>
  );
};

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  android: { elevation: 6 },
  web: { boxShadow: "0px 4px 16px rgba(0,0,0,0.12)" },
}) as ViewStyle;

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    bottom: 116, // clears floating tab bar (72 + 24 + 20)
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    ...shadow,
  },
  compact: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  extended: {
    height: 52,
    borderRadius: 26,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
});

export default Fab;

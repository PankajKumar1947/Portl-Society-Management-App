import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { theme } from "../../constants";

export interface SectionTitleProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  action,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text style={styles.action}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  action: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },
});

export default SectionTitle;

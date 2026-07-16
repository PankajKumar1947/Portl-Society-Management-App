import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { theme } from "../../constants";
import { Avatar } from "./avatar";

export interface PersonListItemProps {
  name: string;
  subtitle?: string;
  meta?: string;
  imageUrl?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const PersonListItem: React.FC<PersonListItemProps> = ({
  name,
  subtitle,
  meta,
  imageUrl,
  rightElement,
  onPress,
  style,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Avatar name={name} imageUrl={imageUrl} size="md" />

      <View style={styles.textBlock}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>

      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  textBlock: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  right: {
    marginLeft: theme.spacing.sm,
    alignItems: "flex-end",
  },
});

export default PersonListItem;

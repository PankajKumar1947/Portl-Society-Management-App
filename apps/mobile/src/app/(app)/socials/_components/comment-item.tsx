import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { theme } from "@/constants";
import { Comment } from "./types";

interface CommentItemProps {
  comment: Comment;
  isFocused?: boolean;
  onPress?: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isFocused = false,
  onPress,
}) => {
  const getRoleBadgeVariant = (role: "resident" | "admin" | "guard") => {
    switch (role) {
      case "admin":
        return "danger";
      case "guard":
        return "warning";
      default:
        return "primary";
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.commentItem,
        isFocused && styles.commentItemFocused,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Avatar name={comment.authorName} size="xs" style={styles.commentAvatar} />
      <View
        style={[
          styles.commentBubble,
          isFocused && styles.commentBubbleFocused,
        ]}
      >
        <View style={styles.commentAuthorHeader}>
          <Text style={styles.commentAuthorName}>{comment.authorName}</Text>
          <Badge
            variant={getRoleBadgeVariant(comment.authorRole)}
            textStyle={{ fontSize: 9 }}
            style={styles.commentBadge}
          >
            {comment.authorRole}
          </Badge>
          <Text style={styles.commentTime}>{comment.time}</Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: theme.radius.md,
  },
  commentItemFocused: {
    backgroundColor: theme.colors.primaryLight,
  },
  commentAvatar: {
    marginTop: 2,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  commentBubbleFocused: {
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.surface,
  },
  commentAuthorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthorName: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  commentBadge: {
    marginLeft: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  commentTime: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginLeft: "auto",
  },
  commentText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },
});

export default CommentItem;

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Avatar } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { PostCard } from "./_components/post-card";
import { CommentItem } from "./_components/comment-item";
import {
  useGetSocialsPostDetail,
  useToggleSocialsLike,
  useAddSocialsComment,
} from "@repo/operations";
import { SocialsPost as Post, SocialsComment as Comment } from "@repo/schema";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import NotFoundScreen from "@/components/layout/not-found-screen";
import ScreenHeader from "@/components/ui/screen-header";



export default function PostDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id = "", focusedCommentId } = useLocalSearchParams<{ id: string; focusedCommentId?: string }>();

  const { data: post, isLoading } = useGetSocialsPostDetail(id);
  const { mutate: toggleLike } = useToggleSocialsLike();
  const { mutate: addComment } = useAddSocialsComment();

  const [newCommentText, setNewCommentText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () => {
      parent?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const handleLike = () => {
    if (!post) return;
    toggleLike(post.id);
  };

  const handleAddComment = () => {
    if (!post || !newCommentText.trim()) return;

    addComment(
      { id: post.id, data: { content: newCommentText } },
      {
        onSuccess: () => {
          setNewCommentText("");
          // Scroll to bottom of comments list after adding
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
        onError: () => {
          Alert.alert("Error", "Failed to add comment. Please try again.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { marginBottom: -(60 + (insets.bottom > 0 ? insets.bottom : 8)) }]} edges={["top", "left", "right"]}>
        <ScreenHeader title="Post Details" onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading post details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) return <NotFoundScreen title="Post Not Found" message="The post you are looking for does not exist." />

  return (
    <SafeAreaView style={[styles.safeArea, { marginBottom: -(60 + (insets.bottom > 0 ? insets.bottom : 8)) }]} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScreenHeader title="Post Details" onBack={() => router.back()} />

        {/* Post details & Comments List */}
        <FlatList
          ref={flatListRef}
          data={post.comments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <PostCard post={post} onLike={handleLike} />

              {/* Add Comment Input Form at the Top */}
              <View style={styles.topInputContainer}>
                <Avatar name="Pankaj Kumar" size="xs" />
                <TextInput
                  placeholder="Write a comment..."
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.commentInput}
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    newCommentText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
                  ]}
                  onPress={handleAddComment}
                  disabled={!newCommentText.trim()}
                >
                  <Ionicons
                    name="send"
                    size={18}
                    color={newCommentText.trim() ? theme.colors.surface : theme.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.commentsHeading}>Comments ({post.comments.length})</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              isFocused={item.id === focusedCommentId}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyComments}>
              <Ionicons name="chatbubbles-outline" size={40} color={theme.colors.textMuted} />
              <Text style={styles.emptyCommentsText}>No comments yet. Be the first to comment!</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  postContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  postAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorName: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  postTimeRow: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  postDivider: {
    marginBottom: theme.spacing.xs,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xs,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: theme.spacing.xs,
  },
  actionButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
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
  emptyComments: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyCommentsText: {
    marginTop: theme.spacing.sm,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  topInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
  },
  commentInput: {
    flex: 1,
    maxHeight: 80,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs * 1.5,
    marginHorizontal: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: theme.colors.primaryDark,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
});

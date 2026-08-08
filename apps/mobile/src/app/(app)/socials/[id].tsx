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
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Avatar } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Post, Comment } from "./_components/types";
import { PostCard } from "./_components/post-card";
import { CommentItem } from "./_components/comment-item";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import NotFoundScreen from "@/components/layout/not-found-screen";
import ScreenHeader from "@/components/ui/screen-header";

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    authorName: "Ananya Sharma",
    authorRole: "resident",
    authorRoleLabel: "Resident · Flat 402, Block A",
    time: "2h ago",
    content: "Hey everyone! Found a set of keys near the children's play area this evening. They are with the guard at the main gate. Please collect them if they belong to you! 🔑",
    likes: 12,
    commentsCount: 3,
    hasLiked: false,
    comments: [
      {
        id: "c1",
        authorName: "Rohan Verma",
        authorRole: "resident",
        authorRoleLabel: "Resident · Flat 501",
        content: "Thanks for sharing, Ananya. I think Mr. Mehta from block B was looking for keys earlier.",
        time: "1h ago",
      },
    ],
  },
  {
    id: "2",
    authorName: "Commanding Officer Baldev Singh",
    authorRole: "guard",
    authorRoleLabel: "Security Supervisor",
    time: "4h ago",
    content: "Routine security drill scheduled for tomorrow morning from 10:00 AM to 11:30 AM at the main gate. Kindly cooperate with the guards. Visitors may experience short delays.",
    images: [
      "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800&auto=format&fit=crop&q=60"
    ],
    likes: 24,
    commentsCount: 2,
    hasLiked: true,
    comments: [],
  },
  {
    id: "3",
    authorName: "Society Management Office",
    authorRole: "admin",
    authorRoleLabel: "Admin · President Office",
    time: "1d ago",
    content: "Clubhouse renovation is almost done! Here is a sneak peek of the new gym area and lounge space. Reopening this Sunday! ☕🎉",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60"
    ],
    likes: 56,
    commentsCount: 1,
    hasLiked: false,
    comments: [
      {
        id: "c2",
        authorName: "Priyanka Sen",
        authorRole: "resident",
        authorRoleLabel: "Resident · Flat 1004",
        content: "Looks stunning! Kudos to the committee for pulling this off. Can't wait for Sunday!",
        time: "18h ago",
      },
    ],
  },
  {
    id: "4",
    authorName: "Ramesh Kumar",
    authorRole: "admin",
    authorRoleLabel: "Admin · Security Head",
    time: "2d ago",
    content: "New RFID scanner gates installed at Tower C entrance to improve automated security checkups. Residents can collect tags from the office starting tomorrow. 🚙🛡️",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
    ],
    likes: 42,
    commentsCount: 0,
    hasLiked: false,
    comments: [],
  },
];

export default function PostDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id, focusedCommentId } = useLocalSearchParams<{ id: string; focusedCommentId?: string }>();
  const [post, setPost] = useState<Post | null>(null);
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

  useEffect(() => {
    const foundPost = INITIAL_POSTS.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  const handleLike = () => {
    if (!post) return;
    const updatedHasLiked = !post.hasLiked;
    setPost({
      ...post,
      hasLiked: updatedHasLiked,
      likes: updatedHasLiked ? post.likes + 1 : post.likes - 1,
    });
  };

  const handleAddComment = () => {
    if (!post || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: "Pankaj Kumar",
      authorRole: "admin",
      authorRoleLabel: "Admin · Flat 303 (Me)",
      content: newCommentText,
      time: "Just now",
    };

    setPost({
      ...post,
      commentsCount: post.commentsCount + 1,
      comments: [...post.comments, newComment],
    });
    setNewCommentText("");

    // Scroll to bottom of comments list after adding
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

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

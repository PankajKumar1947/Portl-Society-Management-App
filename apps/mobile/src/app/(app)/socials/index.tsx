import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Post, Comment } from "./_components/types";
import { PostCard } from "./_components/post-card";
import { CommentItem } from "./_components/comment-item";

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

type FilterType = "all" | "resident" | "admin" | "guard";

export default function SocialsScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [newPostText, setNewPostText] = useState("");
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const updatedHasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: updatedHasLiked,
            likes: updatedHasLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorName: "Pankaj Kumar", // Current user stub
      authorRole: "admin",
      authorRoleLabel: "Admin · Flat 303 (Me)",
      time: "Just now",
      content: newPostText,
      likes: 0,
      commentsCount: 0,
      hasLiked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    Alert.alert("Success", "Post shared with the society!");
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: "Pankaj Kumar",
      authorRole: "admin",
      authorRoleLabel: "Admin · Flat 303 (Me)",
      content: newCommentText,
      time: "Just now",
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    setNewCommentText("");
  };

  const filteredPosts = posts.filter(
    (post) => activeFilter === "all" || post.authorRole === activeFilter
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Society Socials</Text>
        <Text style={styles.headerSubtitle}>Connect with your neighbors, admins & guards</Text>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Create Post Section */}
            <Card style={styles.createCard} variant="flat">
              <View style={styles.createRow}>
                <Avatar name="Pankaj Kumar" size="sm" />
                <TextInput
                  placeholder="Share something with your society..."
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.createInput}
                  multiline
                  value={newPostText}
                  onChangeText={setNewPostText}
                />
              </View>
              <Divider style={styles.createDivider} />
              <View style={styles.createActions}>
                <TouchableOpacity style={styles.mediaButton}>
                  <Ionicons name="image-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.mediaButtonText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton}>
                  <Ionicons name="bar-chart-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.mediaButtonText}>Poll</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.postButton, !newPostText.trim() && styles.postButtonDisabled]}
                  onPress={handleCreatePost}
                  disabled={!newPostText.trim()}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </Card>

            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
              contentContainerStyle={styles.filtersContent}
            >
              {(["all", "resident", "admin", "guard"] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterPill,
                    activeFilter === filter && styles.filterPillActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      activeFilter === filter && styles.filterPillTextActive,
                    ]}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1) + "s"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <View>
            <PostCard
              post={item}
              onPress={() => router.push({ pathname: "/socials/[id]", params: { id: item.id } })}
              onLike={() => handleLike(item.id)}
              onCommentPress={() =>
                setSelectedPostComments(selectedPostComments === item.id ? null : item.id)
              }
            />

            {/* Comments Expanded Section */}
            {selectedPostComments === item.id && (
              <View style={styles.commentsSection}>
                <Divider style={styles.commentsDivider} />

                {/* New Comment Input */}
                <View style={styles.commentInputRow}>
                  <Avatar name="Pankaj Kumar" size="xs" />
                  <TextInput
                    placeholder="Write a comment..."
                    placeholderTextColor={theme.colors.textMuted}
                    style={styles.commentInput}
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                  />
                  <TouchableOpacity
                    onPress={() => handleAddComment(item.id)}
                    disabled={!newCommentText.trim()}
                  >
                    <Ionicons
                      name="send"
                      size={20}
                      color={newCommentText.trim() ? theme.colors.primaryDark : theme.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Comments List */}
                {item.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onPress={() =>
                      router.push({
                        pathname: "/socials/[id]",
                        params: { id: item.id, focusedCommentId: comment.id },
                      })
                    }
                  />
                ))}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: theme.fontWeights.extrabold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 80, // bottom padding for tabs
  },
  createCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  createInput: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 40,
    textAlignVertical: "top",
    paddingTop: 4,
  },
  createDivider: {
    marginVertical: theme.spacing.sm,
  },
  createActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  mediaButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs * 1.5,
    borderRadius: theme.radius.full,
  },
  postButtonDisabled: {
    backgroundColor: theme.colors.surfaceSecondary,
    opacity: 0.6,
  },
  postButtonText: {
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: theme.spacing.md,
  },
  filtersContent: {
    paddingRight: theme.spacing.md,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs * 1.5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.xs,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  filterPillTextActive: {
    color: theme.colors.text,
    fontWeight: theme.fontWeights.bold,
  },
  postCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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
    height: 180,
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
  commentsSection: {
    marginTop: theme.spacing.sm,
  },
  commentsDivider: {
    marginVertical: theme.spacing.sm,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.sm,
    fontSize: 13,
    color: theme.colors.text,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  commentAvatar: {
    marginTop: 2,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
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

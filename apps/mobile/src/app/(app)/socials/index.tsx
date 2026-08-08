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
import { PostCard } from "./_components/post-card";
import { CommentItem } from "./_components/comment-item";
import {
  useGetSocialsFeed,
  useCreateSocialsPost,
  useToggleSocialsLike,
  useAddSocialsComment,
} from "@repo/operations";
import { SocialsPost as Post, SocialsComment as Comment } from "@repo/schema";



type FilterType = "all" | "resident" | "admin" | "guard";

export default function SocialsScreen() {
  const router = useRouter();
  const { data: posts = [], isLoading, refetch } = useGetSocialsFeed();
  const { mutate: toggleLike } = useToggleSocialsLike();
  const { mutate: addComment } = useAddSocialsComment();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const handleLike = (postId: string) => {
    toggleLike(postId);
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    addComment(
      { id: postId, data: { content: newCommentText } },
      {
        onSuccess: () => {
          setNewCommentText("");
        },
        onError: () => {
          Alert.alert("Error", "Failed to add comment. Please try again.");
        },
      }
    );
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    const roleMap: Record<string, string> = {
      resident: "RESIDENTS",
      admin: "ADMIN",
      guard: "GUARD",
    };
    return post.authorRole === roleMap[activeFilter];
  });

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
        refreshing={isLoading}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            {/* Create Post Section */}
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => router.push("/socials/new-post")}
            >
              <Card style={styles.createCard} variant="flat">
                <View style={styles.createRow}>
                  <Avatar name="Pankaj Kumar" size="sm" />
                  <View style={styles.createInputTrigger}>
                    <Text style={styles.createTriggerText}>Share something with your society...</Text>
                  </View>
                </View>
                <Divider style={styles.createDivider} />
                <View style={styles.createActions}>
                  <View style={styles.mediaButton}>
                    <Ionicons name="image-outline" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.mediaButtonText}>Photo</Text>
                  </View>
                  <View style={styles.mediaButton}>
                    <Ionicons name="bar-chart-outline" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.mediaButtonText}>Poll</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>

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
  createInputTrigger: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: "center",
    minHeight: 32,
  },
  createTriggerText: {
    fontSize: 14,
    color: theme.colors.textMuted,
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

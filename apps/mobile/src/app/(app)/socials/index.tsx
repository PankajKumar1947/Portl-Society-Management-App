import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Avatar } from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostCard } from "./_components/post-card";
import { CommentItem } from "./_components/comment-item";
import ScreenHeader from "@/components/ui/screen-header";
import FilterModal from "./_components/filter-modal";
import {
  useGetSocialsFeed,
  useToggleSocialsLike,
  useAddSocialsComment,
} from "@repo/operations";

type FilterType = "all" | "resident" | "admin" | "guard";

export default function SocialsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTimeRange, setActiveTimeRange] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: posts = [], isLoading, refetch } = useGetSocialsFeed({
    search: searchQuery || undefined,
    role: activeFilter,
    timeRange: activeTimeRange,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { mutate: toggleLike } = useToggleSocialsLike();
  const { mutate: addComment } = useAddSocialsComment();

  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempFilter, setTempFilter] = useState<FilterType>("all");
  const [tempTimeRange, setTempTimeRange] = useState<string>("all");
  const [tempStartDate, setTempStartDate] = useState<string>("");
  const [tempEndDate, setTempEndDate] = useState<string>("");

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

  const activeFilterCount = (activeFilter !== "all" ? 1 : 0) + (activeTimeRange !== "all" ? 1 : 0);

  const applyFilters = () => {
    setActiveFilter(tempFilter);
    setActiveTimeRange(tempTimeRange);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setTempFilter("all");
    setTempTimeRange("all");
    setTempStartDate("");
    setTempEndDate("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader
        title="Society Socials"
        showBack={false}
        rightElement={
          <TouchableOpacity
            onPress={() => router.push("/socials/new-post")}
            style={styles.createButton}
          >
            <Ionicons name="add-circle-outline" size={26} color={theme.colors.primary} />
          </TouchableOpacity>
        }
      />

      {/* Search and Filter Row */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
            <TextInput
              placeholder="Search posts or neighbors..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setTempFilter(activeFilter);
              setFilterModalVisible(true);
            }}
          >
            <Ionicons name="options-outline" size={22} color={theme.colors.text} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
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
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        roleFilter={activeFilter}
        timeRange={activeTimeRange}
        startDate={startDate}
        endDate={endDate}
        onApply={(filters) => {
          setActiveFilter(filters.roleFilter);
          setActiveTimeRange(filters.timeRange);
          setStartDate(filters.startDate);
          setEndDate(filters.endDate);
          setFilterModalVisible(false);
        }}
        onClear={clearFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  createButton: {
    paddingHorizontal: theme.spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  searchRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    height: "100%",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: theme.fontWeights.bold,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 80,
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

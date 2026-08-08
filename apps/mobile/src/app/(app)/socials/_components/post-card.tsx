import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle, Modal, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Post } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike: () => void;
  onCommentPress?: () => void;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onCommentPress,
  showActions = true,
}) => {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

  return (
    <Card style={styles.postCard} variant={onPress ? "elevated" : "flat"} onPress={onPress}>
      {/* Header info */}
      <View style={styles.postHeader}>
        <Avatar name={post.authorName} imageUrl={post.authorAvatar} size="md" />
        <View style={styles.postHeaderInfo}>
          <View style={styles.postAuthorRow}>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <Badge variant={getRoleBadgeVariant(post.authorRole)}>
              {post.authorRole}
            </Badge>
          </View>
          <Text style={styles.postTimeRow}>
            {post.authorRoleLabel} · {post.time}
          </Text>
        </View>
      </View>

      {/* Content text */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Optional Images Grid */}
      {post.images && post.images.length > 0 && (
        <View style={styles.imageGrid}>
          {post.images.slice(0, 3).map((imgUri, index) => {
            const count = post.images!.length;
            const isLast = index === 2 && count > 3;

            let imgStyle: ViewStyle = styles.gridImageSingle;
            if (count === 2) {
              imgStyle = styles.gridImageDouble;
            } else if (count >= 3) {
              imgStyle = styles.gridImageTriple;
            }

            return (
              <TouchableOpacity
                key={index}
                style={imgStyle}
                activeOpacity={0.9}
                onPress={() => {
                  setActiveImageIndex(index);
                  setGalleryVisible(true);
                }}
              >
                <Image source={{ uri: imgUri }} style={styles.fullImage} resizeMode="cover" />
                {isLast && (
                  <View style={styles.moreImagesOverlay}>
                    <Text style={styles.moreImagesText}>+{count - 3}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Lightbox Image Gallery Modal */}
      <Modal
        visible={galleryVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGalleryVisible(false)}
      >
        <SafeAreaView style={styles.lightboxOverlay}>
          {/* Header */}
          <View style={styles.lightboxHeader}>
            <Text style={styles.lightboxIndexText}>
              {activeImageIndex + 1} of {post.images?.length || 1}
            </Text>
            <TouchableOpacity
              onPress={() => setGalleryVisible(false)}
              style={styles.lightboxCloseBtn}
            >
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen Swipable Images */}
          {post.images && post.images.length > 0 && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: activeImageIndex * Dimensions.get("window").width, y: 0 }}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get("window").width);
                setActiveImageIndex(newIndex);
              }}
              style={styles.lightboxScrollView}
            >
              {post.images.map((imgUri, idx) => (
                <View key={idx} style={styles.lightboxImageWrapper}>
                  <Image
                    source={{ uri: imgUri }}
                    style={styles.lightboxImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {showActions && (
        <>
          <Divider style={styles.postDivider} />

          {/* Action Bar */}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onLike}>
              <Ionicons
                name={post.hasLiked ? "heart" : "heart-outline"}
                size={22}
                color={post.hasLiked ? theme.colors.danger : theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  post.hasLiked && { color: theme.colors.danger, fontWeight: "600" },
                ]}
              >
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.actionButtonText}>{post.commentsCount}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
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
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    height: 180,
  },
  gridImageSingle: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  gridImageDouble: {
    width: "49%",
    height: "100%",
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  gridImageTriple: {
    width: "32%",
    height: "100%",
    borderRadius: theme.radius.md,
    overflow: "hidden",
    position: "relative",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  moreImagesOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
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
  lightboxOverlay: {
    flex: 1,
    backgroundColor: "#000000",
  },
  lightboxHeader: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  lightboxIndexText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: theme.fontWeights.semibold,
  },
  lightboxCloseBtn: {
    padding: theme.spacing.xs,
  },
  lightboxScrollView: {
    flex: 1,
  },
  lightboxImageWrapper: {
    width: Dimensions.get("window").width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxImage: {
    width: "100%",
    height: "80%",
  },
});

export default PostCard;

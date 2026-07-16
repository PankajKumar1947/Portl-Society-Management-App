import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType, Dimensions } from "react-native";
import { theme } from "../../../constants";

const { width, height } = Dimensions.get("window");

export interface OnboardingSlideProps {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  isLast?: boolean;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  image,
  title,
  subtitle,
  isLast = false,
}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.backgroundImage} resizeMode="cover" />

      {/* Overlay visitor notification bubble specifically on the visitor management slide */}
      {!isLast && title.includes("Visitor") && (
        <View style={styles.visitorNotificationBubble}>
          <View style={styles.visitorHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
              style={styles.visitorAvatar}
            />
            <View>
              <Text style={styles.visitorLabel}>Visitor</Text>
              <Text style={styles.visitorName}>Rahul Sharma</Text>
              <Text style={styles.visitorFlat}>Flat 1203</Text>
            </View>
          </View>
          <View style={styles.visitorActions}>
            <View style={styles.declineBtn}><Text style={styles.declineText}>Decline</Text></View>
            <View style={styles.approveBtn}><Text style={styles.approveText}>Approve</Text></View>
          </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        {!isLast ? (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </>
        ) : (
          <View style={styles.lastSlideSpacing} />
        )}
      </View>
    </View>
  );
};

export default OnboardingSlide;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: "100%",
    backgroundColor: theme.colors.background,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: "100%",
  },
  visitorNotificationBubble: {
    position: "absolute",
    top: height * 0.10,
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm * 1.5,
    borderRadius: theme.radius.lg,
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 10,
  },
  visitorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  visitorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  visitorLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeights.semibold,
    textTransform: "uppercase",
  },
  visitorName: {
    fontSize: 15,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  visitorFlat: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  visitorActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: theme.spacing.xs * 1.5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: "center",
  },
  declineText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.semibold,
  },
  approveBtn: {
    flex: 1,
    paddingVertical: theme.spacing.xs * 1.5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  approveText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.semibold,
  },
  contentContainer: {
    position: "absolute",
    bottom: 110,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: theme.fontWeights.black,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  lastSlideSpacing: {
    height: 60,
  },
});

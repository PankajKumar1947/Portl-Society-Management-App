import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { theme } from "../../constants";
import { OnboardingSlide } from "./_components/onboarding-slide";
import { OnboardingIndicator } from "./_components/onboarding-indicator";
import { Button } from "../../components/ui/button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    image: require("../../../assets/images/security-guard.png"),
    title: "Smarter Visitor\nManagement",
    subtitle: "Visitor requests, approvals and\nreal-time entry logs in one place.",
  },
  {
    image: require("../../../assets/images/community-splash.png"),
    title: "Everything Your\nCommunity Needs",
    subtitle: "Notices, amenities, helpdesk, polls and\npayments – all in your pocket.",
  },
  {
    image: require("../../../assets/images/notice-board.png"),
    title: "Stay Connected,\nStay Informed",
    subtitle: "Get real-time updates, participate in polls\nand never miss an important notice.",
  },
  {
    image: require("../../../assets/images/get-start-splash.png"),
    title: "",
    subtitle: "",
    isLast: true,
  },
];

export default function OnboardingIndex() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleSkip = () => {
    // Jump straight to the last slide
    scrollViewRef.current?.scrollTo({
      x: (SLIDES.length - 1) * width,
      animated: true,
    });
    setActiveIndex(SLIDES.length - 1);
  };

  const handleGetStarted = () => {
    alert("Welcome to Portl!");
  };

  const currentSlide = SLIDES[activeIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <OnboardingSlide
            key={index}
            image={slide.image}
            title={slide.title}
            subtitle={slide.subtitle}
            isLast={slide.isLast}
          />
        ))}
      </ScrollView>

      {/* Dynamic bottom controls based on page state */}
      {!currentSlide.isLast ? (
        <View style={[styles.controlsContainer, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}>
          <Button variant="outline" size="sm" onPress={handleSkip} style={styles.skipButton}>
            Skip
          </Button>

          <OnboardingIndicator total={SLIDES.length} activeIndex={activeIndex} />

          <Button variant="primary" size="md" onPress={handleNext} style={styles.nextButton}>
            Next
          </Button>
        </View>
      ) : (
        <View style={[styles.lastSlideControlsContainer, { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) }]}>
          <Button variant="primary" size="lg" onPress={handleGetStarted} style={styles.getStartedButton}>
            Get Started
          </Button>
          <Button variant="ghost" size="sm" onPress={() => { }} style={styles.footerTextButton} disabled={true}>
            Let's build a better community together.
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: "transparent",
  },
  skipButton: {
    minWidth: 60,
    alignItems: "flex-start",
  },
  nextButton: {
    minWidth: 80,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  lastSlideControlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
    backgroundColor: "transparent",
    gap: theme.spacing.xs,
  },
  getStartedButton: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
  },
  footerTextButton: {
    marginTop: theme.spacing.xs,
  },
});



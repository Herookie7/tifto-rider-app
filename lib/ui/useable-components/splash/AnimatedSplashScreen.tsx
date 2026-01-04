import "expo-dev-client";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SplashVideo from "./SplashVideo";

export default function AnimatedSplashScreen({ children }: any) {
  const opacityAnimation = useSharedValue(1); // Shared value for opacity
  const scaleAnimation = useSharedValue(1); // Shared value for scale
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashVideoComplete, setSplashVideoComplete] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  // Timeout fallback to ensure app always loads (max 3 seconds after video should complete)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isSplashAnimationComplete) {
        console.log("Splash screen timeout - forcing transition");
        SplashScreen.hideAsync().catch(() => { }); // Ensure native splash is hidden
        setAnimationComplete(true);
        opacityAnimation.value = withTiming(0, { duration: 300 });
        scaleAnimation.value = withTiming(2, { duration: 300 });
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isSplashAnimationComplete, opacityAnimation, scaleAnimation]);

  useEffect(() => {
    if (isAppReady && isSplashVideoComplete) {
      console.log("Splash: Starting fade out animation");
      // Start fade out and scale down animation when the app is ready and video has completed
      opacityAnimation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });

      scaleAnimation.value = withTiming(
        2,
        {
          duration: 300,
          easing: Easing.out(Easing.exp),
        },
        () => {
          console.log("Splash: Animation completed, showing app content");
          runOnJS(setAnimationComplete)(true); // Update the animation completion state
        },
      );
    } else {
      console.log("Splash: Waiting for app ready and video complete", { isAppReady, isSplashVideoComplete });
    }
  }, [isAppReady, isSplashVideoComplete]);

  const onImageLoaded = useCallback(async () => {
    try {
      console.log("Splash: Video loaded, hiding splash screen");
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
      console.log("Splash: App resources loaded");
    } catch (e) {
      console.error("Splash: Error hiding splash screen:", e);
      // Handle errors - still mark as ready
    } finally {
      console.log("Splash: Marking app as ready");
      setAppReady(true);
    }
  }, []);

  // Fallback: If video doesn't complete after 2 seconds of being ready, force completion
  useEffect(() => {
    if (isAppReady && !isSplashVideoComplete) {
      const fallbackTimeout = setTimeout(() => {
        console.log("Video completion fallback - marking video as complete");
        setSplashVideoComplete(true);
      }, 2000);

      return () => clearTimeout(fallbackTimeout);
    }
  }, [isAppReady, isSplashVideoComplete]);

  const videoElement = useMemo(() => {
    return (
      <SplashVideo
        onLoaded={onImageLoaded}
        onFinish={() => {
          console.log("Splash: Video finished playing");
          setSplashVideoComplete(true); // Mark video as complete
        }}
      />
    );
  }, [onImageLoaded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value, // Use shared value for opacity
      transform: [{ scale: scaleAnimation.value }], // Use shared value for scale
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {isSplashAnimationComplete ? children : null}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          animatedStyle,
          { backgroundColor: "black" },
        ]}
      >
        {videoElement}
      </Animated.View>
    </View>
  );
}

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

// Use simple splash in production to avoid expo-video/React 19 compatibility issues
const USE_VIDEO_SPLASH = __DEV__;

function SplashVideoWrapper({
  onLoaded,
  onFinish,
}: {
  onLoaded: () => void;
  onFinish: () => void;
}) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await SplashScreen.hideAsync();
        if (mounted) onLoaded();
        await new Promise((r) => setTimeout(r, USE_VIDEO_SPLASH ? 500 : 800));
        if (mounted) onFinish();
      } catch {
        if (mounted) {
          onLoaded();
          onFinish();
        }
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!USE_VIDEO_SPLASH) {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]} />;
  }

  try {
    const SplashVideo = require("./SplashVideo").default;
    return <SplashVideo onLoaded={onLoaded} onFinish={onFinish} />;
  } catch {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]} />;
  }
}

export default function AnimatedSplashScreen({ children }: any) {
  const opacityAnimation = useSharedValue(1);
  const scaleAnimation = useSharedValue(1);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashVideoComplete, setSplashVideoComplete] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isSplashAnimationComplete) {
        SplashScreen.hideAsync().catch(() => {});
        setAnimationComplete(true);
        opacityAnimation.value = withTiming(0, { duration: 300 });
        scaleAnimation.value = withTiming(2, { duration: 300 });
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, [isSplashAnimationComplete, opacityAnimation, scaleAnimation]);

  useEffect(() => {
    if (isAppReady && isSplashVideoComplete) {
      opacityAnimation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
      scaleAnimation.value = withTiming(
        2,
        { duration: 300, easing: Easing.out(Easing.exp) },
        () => runOnJS(setAnimationComplete)(true)
      );
    }
  }, [isAppReady, isSplashVideoComplete]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch {
      // ignore
    } finally {
      setAppReady(true);
    }
  }, []);

  useEffect(() => {
    if (isAppReady && !isSplashVideoComplete) {
      const t = setTimeout(() => setSplashVideoComplete(true), 2000);
      return () => clearTimeout(t);
    }
  }, [isAppReady, isSplashVideoComplete]);

  const videoElement = useMemo(
    () => (
      <SplashVideoWrapper
        onLoaded={onImageLoaded}
        onFinish={() => setSplashVideoComplete(true)}
      />
    ),
    [onImageLoaded]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnimation.value,
    transform: [{ scale: scaleAnimation.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {isSplashAnimationComplete ? children : null}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, animatedStyle, { backgroundColor: "black" }]}
      >
        {videoElement}
      </Animated.View>
    </View>
  );
}

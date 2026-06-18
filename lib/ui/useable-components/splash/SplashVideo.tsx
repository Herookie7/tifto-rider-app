import { StyleSheet, View } from "react-native";
import { useRef, useState, useEffect } from "react";
import { VideoView, useVideoPlayer, VideoPlayer } from "expo-video";

interface SplashVideoProps {
  onLoaded?: () => void;
  onFinish?: () => void;
}

export default function SplashVideo({ onLoaded, onFinish }: SplashVideoProps) {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const playerRef = useRef<VideoPlayer | null>(null);

  // Create video player instance
  const player = useVideoPlayer(require("@/lib/assets/video/mobile-splash.mp4"), (player) => {
    playerRef.current = player;
    player.loop = false;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    // statusChange listener handles both success (readyToPlay) and error conditions
    const statusSubscription = player.addListener("statusChange", (status) => {
      console.log("Video status changed:", status.status);

      if (status.status === "readyToPlay" && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
      }

      if (status.status === "error" && !hasFinished) {
        console.log("Splash video error:", status.error);
        setHasFinished(true);
        onFinish?.();
      }

      if (status.status === "idle" && hasLoaded && !hasFinished) {
        console.log("Video finished playing (idle status)");
        setHasFinished(true);
        onFinish?.();
      }
    });

    // playToEnd listener handles video completion
    const playToEndSubscription = player.addListener("playToEnd", () => {
      console.log("Video finished playing (playToEnd)");
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    return () => {
      statusSubscription?.remove();
      playToEndSubscription?.remove();
    };
  }, [player, hasLoaded, hasFinished, onLoaded, onFinish]);

  return (
    <View style={{ flex: 1 }}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
      />
    </View>
  );
}
import { useUserContext } from "@/lib/context/global/user.context";
import { usePathname } from "expo-router";
import { isBoolean } from "lodash";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { memo, useMemo } from "react";

function UnavailableStatus() {
  // Hooks
  const pathName = usePathname();
  const { dataProfile } = useUserContext();
  const insets = useSafeAreaInsets(); // Get Safe Area Insets

  // Memoize the availability check
  const shouldShow = useMemo(() => {
    if (pathName && pathName === "/login") return false;
    if (!isBoolean(dataProfile?.available)) return false;
    if (!!dataProfile?.available) return false;
    return true;
  }, [pathName, dataProfile?.available]);

  // Memoize the style object
  const containerStyle = useMemo(
    () => ({
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      paddingTop: insets.top - 9, // Ensures it stays below the notch
      paddingHorizontal: 16,
      paddingBottom: 2,
      position: "absolute" as const,
      width: "100%",
      zIndex: 50,
    }),
    [insets.top]
  );

  if (!shouldShow) return null;

  return (
    <View style={containerStyle}>
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
        You are currently unavailable.
      </Text>
    </View>
  );
}

export default memo(UnavailableStatus);

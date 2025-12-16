import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { Stack } from "expo-router";
import SpinnerComponent from "../../useable-components/spinner";
import { Colors } from "@/lib/utils/constants";
import { useMemo } from "react";

export default function RootStackLayout() {
  // Hooks with error handling
  let appTheme;
  try {
    const themeContext = useApptheme();
    appTheme = themeContext?.appTheme;
  } catch (error) {
    console.error("Error getting theme context:", error);
  }

  // Fallback to light theme if appTheme is not available
  const safeAppTheme = useMemo(() => {
    return appTheme || Colors.light;
  }, [appTheme]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: safeAppTheme.mainTextColor,
        headerTitleStyle: { color: safeAppTheme.mainTextColor },
      }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="order-detail"
        options={{
          // headerShown: false,
          headerTintColor: safeAppTheme.fontMainColor,
        }}
      />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}

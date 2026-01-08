import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/lib/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "card";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "default",
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === "card" ? "cardBackground" : "themeBackground",
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

import { useApptheme } from "@/lib/context/global/theme.context";

export function useTheme() {
    const { appTheme, currentTheme } = useApptheme();

    return {
        colors: {
            ...appTheme,
            background: appTheme.screenBackground,
            text: appTheme.fontMainColor,
            textSecondary: appTheme.fontSecondColor,
            card: appTheme.cardBackground,
            border: appTheme.borderColor,
        },
        scheme: currentTheme,
    };
}

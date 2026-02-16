// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { app_theme } from "@/lib/utils/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

// Core
import { Text, View, TouchableOpacity } from "react-native";
import { Switch } from "react-native-switch";

// Types
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";
import { Dispatch, SetStateAction } from "react";

export default function OtherDetailsSection({
  setIsFormOpened,
}: {
  setIsFormOpened: Dispatch<SetStateAction<TRiderProfileBottomBarBit>>;
}) {
  // Hooks
  const { t } = useTranslation();
  const { dataProfile } = useUserContext();
  const { currentTheme, toggleTheme, appTheme } = useApptheme();

  return (
    <View className="flex flex-col justify-between items-start h-[40%] w-full px-4 py-2 pb-20 my-5">
      <View className="flex flex-row items-center justify-between w-full">
        <Text
          className="text-xl font-bold"
          style={{ color: appTheme.mainTextColor }}
        >
          {t("Other information")}
        </Text>
        <TouchableOpacity onPress={() => setIsFormOpened("PROFILE_FORM")}>
          <Text className="font-semibold text-[#0EA5E9]">
            {t("Edit")}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className="flex flex-col gap-3 item-start justify-between w-full   h-20 p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        <Text style={{ color: appTheme.fontSecondColor }}>{t("Email")}</Text>
        <View className="flex-1 h-12 text-base text-black">
          <Text className="h-12" style={{ color: appTheme.fontSecondColor }}>
            {dataProfile?.email ?? t("Not set")}
          </Text>
        </View>
      </View>
      <View
        className="flex flex-col gap-3 item-start justify-between w-full   h-20 p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        <Text style={{ color: appTheme.fontSecondColor }}>{t("Password")}</Text>
        <View className="flex-1 h-12 text-base text-black">
          <Text className="h-12" style={{ color: appTheme.fontSecondColor }}>
            ********
          </Text>
        </View>
      </View>
      <View
        className="flex flex-col gap-3 item-start justify-between w-full   h-20 p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        <Text style={{ color: appTheme.fontSecondColor }}>{t("Phone")}</Text>
        <View className="flex-1 h-12 text-base text-black">
          <Text className="h-12" style={{ color: appTheme.fontSecondColor }}>
            {dataProfile?.phone ?? t("Not set")}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center justify-between w-full">
        <Text
          className="text-xl font-bold"
          style={{
            color: appTheme.mainTextColor,
          }}
        >
          {t("Theme")}
        </Text>
        <View className="flex flex-row gap-2 items-center justify-center">
          <Switch
            containerStyle={{ width: "20%" }}
            switchWidthMultiplier={3}
            activeText={"Dark"}
            inActiveText={"Light"}
            renderInsideCircle={() => {
              return (
                <Ionicons
                  name={
                    currentTheme === "dark"
                      ? "moon"
                      : currentTheme === "light"
                        ? "sunny"
                        : "phone-portrait"
                  }
                  size={22}
                />
              );
            }}
            circleActiveColor={appTheme.primary}
            backgroundActive={appTheme.primary}
            activeTextStyle={{ color: appTheme.black }}
            value={currentTheme === "dark"}
            onValueChange={() => toggleTheme(currentTheme as app_theme)}
          />
        </View>
      </View>

      {/* Holiday Request Button */}
      <TouchableOpacity
        className="flex flex-row items-center justify-between w-full p-4 rounded-md my-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
        onPress={() => router.push('/holiday-request')}
      >
        <View className="flex flex-row items-center gap-3">
          <Ionicons name="calendar-outline" size={24} color={appTheme.primary} />
          <Text style={{ color: appTheme.mainTextColor, fontSize: 16, fontWeight: '600' }}>
            {t("Request Holiday/Leave")}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={appTheme.fontSecondColor} />
      </TouchableOpacity>
    </View>
  );
}

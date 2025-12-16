import { useLocationContext } from "@/lib/context/global/location.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { ILocationPermissionComponentProps } from "@/lib/utils/interfaces";
import * as Location from "expo-location";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import SpinnerComponent from "../spinner";

export default function LocationPermissionComponent({
  children,
}: ILocationPermissionComponentProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { setLocationPermission } = useLocationContext();

  // States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);

  const getLocationPermission = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.getForegroundPermissionsAsync();
      setLoading(false);
      setHasCheckedPermission(true);
      
      if (status === "granted") {
        setLocationPermission(true);
        setIsModalVisible(false);
      } else {
        // Don't show modal immediately - allow app to render first
        // Show modal after a short delay to not block initial render
        setTimeout(() => {
          setIsModalVisible(true);
        }, 500);
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      setLoading(false);
      setHasCheckedPermission(true);
      // Allow app to continue even if permission check fails
      setLocationPermission(false);
    }
  }, [setLocationPermission]);

  const LocationAlert = useCallback(async () => {
    try {
      Alert.alert(
        "Location access",
        "Location permissions are required to use this app. Kindly open settings to allow location access.",
        [
          {
            text: "Open settings",
            onPress: async () => {
              try {
                await Linking.openSettings();
              } catch (error) {
                console.error("Error opening settings:", error);
              }
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setIsModalVisible(false);
            },
          },
        ],
      );
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error in location alert:", error);
    }
  }, [setLocationPermission]);

  const askLocationPermission = useCallback(async () => {
    try {
      setLoading(true);
      const { status, canAskAgain } =
        await Location.getForegroundPermissionsAsync();
      setLoading(false);
      
      if (status === "granted") {
        setLocationPermission(true);
        setIsModalVisible(false);
        return;
      }
      
      if (canAskAgain) {
        setLoading(true);
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        setLoading(false);
        if (newStatus === "granted") {
          setLocationPermission(true);
          setIsModalVisible(false);
        } else {
          LocationAlert();
        }
      } else {
        LocationAlert();
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setLoading(false);
      setIsModalVisible(false);
    }
  }, [setLocationPermission, LocationAlert]);

  useEffect(() => {
    // Check permission asynchronously without blocking render
    getLocationPermission();
  }, [getLocationPermission]);

  return (
    <View className="flex-1">
      {/* Always render children - don't block UI */}
      {children}

      {/* Show modal only when needed and after initial check */}
      <Modal
        isVisible={isModalVisible && hasCheckedPermission}
        coverScreen={false}
        backdropOpacity={0.5}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <View className="h-fit w-full bg-transparent justify-around items-center">
          <View
            className="h-fit w-[95%] p-4 items-center justify-around  rounded-[16px]"
            style={{
              backgroundColor: appTheme.themeBackground,
              borderColor: appTheme.borderLineColor,
              borderWidth: 1,
            }}
          >
            <View className="gap-y-2">
              <Text
                className="font-[Inter] font-semibold text-[20px] leading-[28px] tracking-[0px] text-center"
                style={{ color: appTheme.fontMainColor }}
              >
                {t("Enable Location For Better Experience")}
              </Text>
              <Text
                className="font-[Inter] font-[400] text-[14px] leading-[28px] tracking-[0px] text-center"
                style={{ color: appTheme.fontSecondColor }}
              >
                {t(
                  "We need your location to find nearby restaurants, ensure accurate delivery, and provide the best service possible",
                )}
              </Text>
            </View>

            <TouchableOpacity
              className="h-10 rounded-3xl py-2 mt-4 w-[90%]"
              style={{ backgroundColor: appTheme.primary }}
              onPress={askLocationPermission}
            >
              {isLoading ? (
                <SpinnerComponent />
              ) : (
                <Text
                  className="text-center text-[14px] font-medium"
                  style={{ color: appTheme.black }}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

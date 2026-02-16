import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { UPDATE_AVAILABILITY } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import CustomSwitch from "@/lib/ui/useable-components/switch-button";
import { IRiderProfile } from "@/lib/utils/interfaces";
import { MutationTuple, useMutation } from "@apollo/client";
// import { showMessage } from "react-native-flash-message";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { isBoolean } from "lodash";

const CustomDrawerHeader = () => {
  // Hook
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { dataProfile, loadingProfile, userId } = useUserContext();
  const [isRiderAvailable, setIsRiderAvailable] = useState(false);

  useEffect(() => {
    if (dataProfile?.available !== undefined) {
      setIsRiderAvailable(dataProfile.available);
    }
  }, [dataProfile?.available]);

  // Queries
  const [toggleAvailablity, { loading }] = useMutation(UPDATE_AVAILABILITY, {
    refetchQueries: [
      { query: RIDER_PROFILE, variables: { id: dataProfile?._id?.toString() || userId || "" } },
    ],
    awaitRefetchQueries: true,
    onError: (error) => {
      showMessage({
        message:
          error.graphQLErrors[0]?.message ||
          error?.networkError?.message ||
          t("Unable to update availability"),
        type: "danger",
      });
    },
  }) as MutationTuple<IRiderProfile | undefined, { id: string }>;

  return (
    <View
      className="w-full flex-row justify-between px-4 py-4 min-h-[140px]"
      style={{ backgroundColor: appTheme.primary }}
    >
      <View className="flex-1 min-w-0 mr-3">
        <View
          className="w-[40px] h-[40px] rounded-full items-center justify-center overflow-hidden mb-2"
          style={{ backgroundColor: appTheme.white }}
        >
          <Text
            className="text-[18px] font-semibold"
            style={{ color: appTheme.primary }}
          >
            {dataProfile?.name
              ?.split(" ")[0]
              ?.substring(0, 1)
              ?.toUpperCase()
              ?.concat(
                "",
                dataProfile?.name?.split(" ")[1]?.length
                  ? (dataProfile?.name
                      ?.split(" ")[1]
                      ?.substring(0, 1)
                      ?.toUpperCase() ?? "")
                  : ""
              ) ?? "JS"}
          </Text>
        </View>
        <Text
          className="font-semibold text-[16px]"
          style={{ color: appTheme.white }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {dataProfile?.name ?? t("rider name")}
        </Text>
        <Text
          className="font-medium text-[13px] mt-0.5"
          style={{ color: "rgba(255,255,255,0.9)" }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {dataProfile?._id
            ? dataProfile._id.substring(0, 9).toUpperCase()
            : userId
              ? userId.substring(0, 9).toUpperCase()
              : t("rider id")}
        </Text>
      </View>

      <View className="items-end justify-end gap-1.5 flex-shrink-0">
        <Text
          className="text-[13px] font-medium"
          style={{ color: "rgba(255,255,255,0.95)" }}
          numberOfLines={1}
        >
          {t("Availability")}
        </Text>
        {loading || loadingProfile ? (
          <SpinnerComponent color="rgba(255,255,255,0.9)" />
        ) : (
          <CustomSwitch
            value={isRiderAvailable}
            isDisabled={loading || !dataProfile?._id || !userId}
            onToggle={async () => {
              try {
                const riderId = dataProfile?._id?.toString() || userId;
                if (!riderId) {
                  showMessage({
                    message: t("User ID is missing. Please wait for profile to load."),
                    type: "danger",
                  });
                  return;
                }

                await toggleAvailablity({
                  variables: { id: riderId },
                });
              } catch (error) {
                // Error is already handled in the mutation's onError callback
                console.error("Toggle availability error:", error);
              }
            }}
          />
        )}

        <Text
          className="text-[11px] font-medium"
          style={{ color: "rgba(255,255,255,0.9)" }}
          numberOfLines={1}
        >
          {isBoolean(dataProfile?.available)
            ? dataProfile?.available
              ? t("Available")
              : t("Not Available")
            : ""}
        </Text>
      </View>
    </View>
  );
};

export default CustomDrawerHeader;

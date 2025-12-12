/* eslint-disable @typescript-eslint/no-require-imports */

import { useApptheme } from "@/lib/context/global/theme.context";
import UserContext from "@/lib/context/global/user.context";
import Order from "@/lib/ui/useable-components/order";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import { NO_ORDER_PROMPT } from "@/lib/utils/constants";
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { ORDER_TYPE } from "@/lib/utils/types";
import { NetworkStatus } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height } = Dimensions.get("window");

function HomeDeliveredOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    dataProfile,
    loadingAssigned,
    errorAssigned,
    assignedOrders,
    refetchAssigned,
    networkStatusAssigned,
    userId,
  } = useContext(UserContext);

  // States
  const [orders, setOrders] = useState<IOrder[]>([]);

  // Handlers
  const onInitOrders = () => {
    if (loadingAssigned || errorAssigned) return;
    if (!assignedOrders) return;

    const _orders = assignedOrders?.filter((o: IOrder) => {
      const isDelivered = ["DELIVERED", "CANCELLED"].includes(o.orderStatus);
      const isCurrentRider = o.rider?._id === dataProfile?._id;
      return isDelivered && isCurrentRider;
    });

    setOrders(_orders ?? []);
  };

  // Use Effect
  useEffect(() => {
    onInitOrders();
  }, [assignedOrders, route.key]);

  useEffect(() => {
    // Trigger refetch when orders length changes
    if (orders?.length === 0) {
      refetchAssigned();
    }
  }, [orders?.length]);

  // Calculate the marginBottom dynamically
  // const marginBottom = Platform.OS === "ios" ? height * 0.0 : height * 0.01;
  // Render
  
  // Show loading state
  if (loadingAssigned && !assignedOrders) {
    return (
      <View
        className="pt-14 flex-1 pb-16 items-center justify-center"
        style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
      >
        <SpinnerComponent />
        <Text
          className="mt-4 text-base"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Loading orders...")}
        </Text>
      </View>
    );
  }

  // Show error state
  if (errorAssigned && !assignedOrders) {
    return (
      <View
        className="pt-14 flex-1 pb-16 items-center justify-center"
        style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
      >
        <WalletIcon height={100} width={100} color={appTheme.fontMainColor} />
        <Text
          className="mt-4 text-base text-center px-4"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Failed to load orders. Please try again.")}
        </Text>
        <TouchableOpacity onPress={refetchAssigned}>
          <Text
            className="mt-2 text-sm text-center px-4"
            style={{ color: appTheme.primary }}
          >
            {t("Tap to retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show message if userId is not available
  if (!userId) {
    return (
      <View
        className="pt-14 flex-1 pb-16 items-center justify-center"
        style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
      >
        <WalletIcon height={100} width={100} color={appTheme.fontMainColor} />
        <Text
          className="mt-4 text-base text-center px-4"
          style={{ color: appTheme.fontSecondColor }}
        >
          {t("Please wait while we load your profile...")}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="pt-14 flex-1 pb-16"
      style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
    >
      {orders?.length > 0 ? (
        <FlashList
          data={orders}
          estimatedItemSize={orders?.length}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshing={networkStatusAssigned === NetworkStatus.loading}
          onRefresh={refetchAssigned}
          renderItem={({ item, index }: { item: IOrder; index: number }) => (
            <Order
              tab={route.key as ORDER_TYPE}
              _id={item._id}
              orderId={item.orderId}
              orderStatus={item.orderStatus}
              restaurant={item.restaurant}
              deliveryAddress={item.deliveryAddress}
              paymentMethod={item.paymentMethod}
              orderAmount={item.orderAmount}
              paymentStatus={item.paymentStatus}
              acceptedAt={item.acceptedAt}
              user={item.user}
            
              isLast={index === orders.length - 1}
            />
          )}
          ListFooterComponent={<View style={{ height: 200 }} />}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  minHeight:
                    height > 670
                      ? height - height * 0.5
                      : height - height * 0.6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WalletIcon
                  height={100}
                  width={100}
                  color={appTheme.fontMainColor}
                />
                {orders?.length === 0 ? (
                  <Text
                    className="font-[Inter] text-[18px] text-base font-[500]"
                    style={{ color: appTheme.fontSecondColor }}
                  >
                    {t(NO_ORDER_PROMPT[route.key])}
                  </Text>
                ) : (
                  <Text style={{ color: appTheme.fontSecondColor }}>
                    {t("Pull down to refresh")}
                  </Text>
                )}
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{
            minHeight:
              height > 670 ? height - height * 0.5 : height - height * 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WalletIcon height={100} width={100} color={appTheme.fontMainColor} />

          {orders?.length === 0 ? (
            <Text
              className="font-[Inter] text-[18px] text-base font-[500]"
              style={{ color: appTheme.fontSecondColor }}
            >
              {t(NO_ORDER_PROMPT[route.key])}
            </Text>
          ) : (
            <Text>{t("Pull down to refresh")}</Text>
          )}
        </View>
      )}
    </View>
  );
}

export default HomeDeliveredOrdersMain;

const style = StyleSheet.create({
  contaienr: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
});

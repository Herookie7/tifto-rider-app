/* eslint-disable @typescript-eslint/no-require-imports */
// Core
import { useContext, useEffect, useState } from "react";

import { NetworkStatus } from "@apollo/client";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Components
import Order from "@/lib/ui/useable-components/order";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
// Context
import UserContext from "@/lib/context/global/user.context";
// Constants
import { NO_ORDER_PROMPT } from "@/lib/utils/constants";
// Interface
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
// Types
import { useApptheme } from "@/lib/context/global/theme.context";
import { ORDER_TYPE } from "@/lib/utils/types";
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import { optimizeRoute, getRouteSummary, DeliveryLocation } from "@/lib/utils/routeOptimization";
import { useOfflineQueue } from "@/lib/hooks/useOfflineQueue";
import OfflineIndicator from "@/lib/ui/useable-components/offline-indicator";

const { height } = Dimensions.get("window");

function HomeProcessingOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const {
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


    const _orders = assignedOrders?.filter(
      (o: IOrder) =>
        ["PICKED", "ASSIGNED"].includes(o.orderStatus) && !o.isPickedUp,
    );

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
  // const marginBottom = Platform.OS === "ios" ? height * 0.5 : height * 0.01;
  // Render

    // console.log({assignedOrders: JSON.stringify(orders, null, 2)});

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

  const routeSummary = optimizedRoute.length > 0 ? getRouteSummary(optimizedRoute) : null;

  return (
    <View
      className="pt-14 flex-1 pb-16"
      style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
    >
      <OfflineIndicator isOnline={isOnline} queuedActionsCount={queuedActions.length} />
      {optimizedRoute.length > 1 && routeSummary && (
        <View
          style={{
            padding: 12,
            marginHorizontal: 16,
            marginBottom: 12,
            backgroundColor: appTheme.cardBackground || appTheme.screenBackground,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: '#007AFF'
          }}
        >
          <Text style={{ color: appTheme.fontMainColor, fontWeight: 'bold', marginBottom: 4 }}>
            {t("Optimized Route") || "Optimized Route"}
          </Text>
          <Text style={{ color: appTheme.fontSecondColor, fontSize: 12 }}>
            {t("Total Distance") || "Total Distance"}: {routeSummary.totalDistance} km
          </Text>
          <Text style={{ color: appTheme.fontSecondColor, fontSize: 12 }}>
            {t("Estimated Time") || "Estimated Time"}: ~{routeSummary.totalTime} min
          </Text>
          <Text style={{ color: appTheme.fontSecondColor, fontSize: 12, marginTop: 4 }}>
            {optimizedRoute.length} {t("deliveries") || "deliveries"} in optimal order
          </Text>
        </View>
      )}
      {orders?.length > 0 ? (
        <FlashList
          data={orders}
          estimatedItemSize={orders?.length}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshing={networkStatusAssigned === NetworkStatus.loading}
          onRefresh={refetchAssigned}
          renderItem={({ item, index }: { item: IOrder; index: number }) => {
            // Find this order in optimized route to show estimated time
            const routeItem = optimizedRoute.find(r => r.orderId === item._id);
            return (
              <View>
                {routeItem && optimizedRoute.length > 1 && (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: appTheme.cardBackground || appTheme.screenBackground,
                      borderBottomWidth: 1,
                      borderBottomColor: appTheme.borderColor || '#eee'
                    }}
                  >
                    <Text style={{ color: appTheme.fontSecondColor, fontSize: 12 }}>
                      {t("Stop") || "Stop"} {optimizedRoute.indexOf(routeItem) + 1} • 
                      {t(" Est. Time") || " Est. Time"}: ~{routeItem.estimatedTime} min • 
                      {t(" Distance") || " Distance"}: {Math.round(routeItem.distance * 10) / 10} km
                    </Text>
                  </View>
                )}
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
              </View>
            );
          }}
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
              className="font-[Inter] text-[18px] text-base font-[500] "
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
      )}
    </View>
  );
}

export default HomeProcessingOrdersMain;

const style = StyleSheet.create({
  contaienr: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
});

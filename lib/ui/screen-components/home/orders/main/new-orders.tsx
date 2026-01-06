/* eslint-disable @typescript-eslint/no-require-imports */
import { NetworkStatus, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Context
import UserContext from "@/lib/context/global/user.context";
// UI
import Order from "@/lib/ui/useable-components/order";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
// Constants
import { NO_ORDER_PROMPT } from "@/lib/utils/constants";
// Interface
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
// Type
import { ORDER_TYPE } from "@/lib/utils/types";
// Icon
import { useApptheme } from "@/lib/context/global/theme.context";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import { GET_PENDING_DELIVERIES_FOR_ZONE, GET_RIDER_ASSIGNMENTS } from "@/lib/apollo/queries/subscription-delivery.query";

const { height } = Dimensions.get("window");

export default function HomeNewOrdersMain(props: IOrderTabsComponentProps) {
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
      (o: IOrder) => o.orderStatus === "ACCEPTED" && !o.rider && !o.isPickedUp,
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

  // Tiffin Query: Available
  const { data: tiffinData, loading: loadingTiffins, refetch: refetchTiffins } = useQuery(GET_PENDING_DELIVERIES_FOR_ZONE, {
    pollInterval: 10000,
    fetchPolicy: "network-only"
  });

  // Tiffin Query: Assignments
  const { data: assignmentData, loading: loadingAssignments, refetch: refetchAssignments } = useQuery(GET_RIDER_ASSIGNMENTS, {
    pollInterval: 10000,
    fetchPolicy: "network-only"
  });

  const tiffinDeliveries = tiffinData?.getPendingDeliveriesForZone || [];
  const myAssignments = assignmentData?.getRiderAssignments || [];

  return (
    <View
      className="pt-14 flex-1 pb-16"
      style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
    >
      <FlashList
        data={orders}
        estimatedItemSize={orders?.length || 1}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={networkStatusAssigned === NetworkStatus.loading || loadingTiffins || loadingAssignments}
        onRefresh={() => {
          refetchAssigned();
          refetchTiffins();
          refetchAssignments();
        }}
        ListHeaderComponent={() => (
          <View>
            {/* My Active Tasks */}
            {myAssignments.length > 0 && (
              <View className="mb-4">
                <Text className="ml-4 my-2 text-lg font-bold" style={{ color: appTheme.fontMainColor }}>
                  {t("My Active Deliveries")}
                </Text>
                {myAssignments.map((tiff: any) => (
                  // eslint-disable-next-line @typescript-eslint/no-require-imports
                  <View key={tiff._id}>
                    {require("@/lib/ui/useable-components/tiffin-card").default({ delivery: tiff })}
                  </View>
                ))}
                <View className="h-0.5 bg-gray-200 my-2 mx-4" />
              </View>
            )}

            {/* Available for Pickup */}
            {tiffinDeliveries.length > 0 && (
              <View className="mb-4">
                <Text className="ml-4 my-2 text-lg font-bold" style={{ color: appTheme.fontMainColor }}>
                  {t("Available Tiffins")}
                </Text>
                {tiffinDeliveries.map((tiff: any) => (
                  // eslint-disable-next-line @typescript-eslint/no-require-imports
                  <View key={tiff._id}>
                    {require("@/lib/ui/useable-components/tiffin-card").default({ delivery: tiff })}
                  </View>
                ))}
                <View className="h-0.5 bg-gray-200 my-2 mx-4" />
              </View>
            )}
            <Text className="ml-4 my-2 text-lg font-bold" style={{ color: appTheme.fontMainColor }}>
              {t("Assigned Orders (Regular)")}
            </Text>
          </View>
        )}
        renderItem={({ item, index }: { item: IOrder; index: number }) => (
          <Order
            tab={route.key as ORDER_TYPE}
            _id={item._id}
            orderStatus={item.orderStatus}
            restaurant={item.restaurant}
            deliveryAddress={item.deliveryAddress}
            paymentMethod={item.paymentMethod}
            orderAmount={item.orderAmount}
            paymentStatus={item.paymentStatus}
            acceptedAt={item.acceptedAt}
            orderId={item.orderId}
            user={item.user}
            key={item._id}
            isLast={index === orders.length - 1}
          />
        )}
        ListEmptyComponent={() => {
          if (tiffinDeliveries.length > 0) return null; // Don't show empty if we have tiffins
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
    </View>
  );
}

const style = StyleSheet.create({
  contaienr: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
});

// Expo
import * as Notifications from "expo-notifications";
import { Href, useRouter } from "expo-router";

// Core
import { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { useLocationContext } from "@/lib/context/global/location.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useApolloClient } from "@apollo/client";

// API
import { RIDER_ORDERS } from "@/lib/apollo/queries";

// Constant
import { RIDER_TOKEN, ROUTES } from "@/lib/utils/constants";

// Interfaces
import { IOrder } from "@/lib/utils/interfaces/order.interface";

function App() {
  const router = useRouter();
  const client = useApolloClient();
  const { appTheme } = useApptheme();
  const { locationPermission } = useLocationContext();
  const [isInitializing, setIsInitializing] = useState(true);

  // Handler
  const init = async () => {
    try {
      setIsInitializing(true);
      // Small delay to ensure router is ready
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const token = await AsyncStorage.getItem(RIDER_TOKEN);
      if (token) {
        router.replace(ROUTES.home as Href);
      } else {
        router.replace(ROUTES.login as Href);
      }
    } catch (error) {
      console.error("Error in init:", error);
      router.replace(ROUTES.login as Href);
    } finally {
      setIsInitializing(false);
    }
  };

  // Notification Handler
  const registerForPushNotification = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      Notifications.setNotificationHandler({
        handleNotification: async () => {
          return {
            shouldShowAlert: false, // Prevent the app from closing
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        },
      });
    }
  };

  const handleNotification = useCallback(
    async (response: Notifications.NotificationResponse) => {
      if (
        response &&
        response.notification &&
        response.notification.request &&
        response.notification.request.content &&
        response.notification.request.content.data
      ) {
        try {
          const { _id } = response.notification.request.content.data;
          const { data } = await client.query({
            query: RIDER_ORDERS,
            fetchPolicy: "network-only",
          });
          const order = data.riderOrders.find((o: IOrder) => o._id === _id);
          const lastNotificationHandledId = await AsyncStorage.getItem(
            "@lastNotificationHandledId"
          );
          if (lastNotificationHandledId === _id) return;
          await AsyncStorage.setItem("@lastNotificationHandledId", _id);

          router.navigate("/order-detail");
          router.setParams({ itemId: _id, order });
        } catch (error) {
          console.error("Error handling notification:", error);
        }
      }
    },
    [client, router]
  );

  // Use Effect
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleNotification);

    return () => subscription.remove();
  }, [handleNotification]);

  useEffect(() => {
    registerForPushNotification();

    // Register a notification handler that will be called when a notification is received.
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: false, // Prevent the app from closing
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });
  }, []);

  useEffect(() => {
    init();
  }, []);

  // Show loading indicator while initializing
  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: appTheme.themeBackground,
        }}
      >
        <ActivityIndicator size="large" color={appTheme.primary} />
      </View>
    );
  }

  // Return null after navigation is complete
  return null;
}

export default App;

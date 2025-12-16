import { QueryResult, useQuery } from "@apollo/client";
import {
  LocationAccuracy,
  LocationObject,
  LocationSubscription,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import { createContext, useContext, useEffect, useRef, useState } from "react";
// Interface
import {
  IRiderProfileResponse,
  IUserContextProps,
  IUserProviderProps,
} from "@/lib/utils/interfaces";
// Context
// import { useLocationContext } from "./location.context";
// API
import { UPDATE_LOCATION } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_ORDERS, RIDER_PROFILE } from "@/lib/apollo/queries";
import {
  SUBSCRIPTION_ASSIGNED_RIDER,
  SUBSCRIPTION_ZONE_ORDERS,
} from "@/lib/apollo/subscriptions";
import { asyncStorageEmitter } from "@/lib/services/async-storage";
import { RIDER_TOKEN } from "@/lib/utils/constants";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import {
  IRiderEarnings,
  IRiderEarningsArray,
} from "@/lib/utils/interfaces/rider-earnings.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext<IUserContextProps>({} as IUserContextProps);

export const UserProvider = ({ children }: IUserProviderProps) => {
  // States
  const [modalVisible, setModalVisible] = useState<
    IRiderEarnings & { bool: boolean }
  >({
    bool: false,
    _id: "",
    date: "",
    earningsArray: [] as IRiderEarningsArray[],
    totalEarningsSum: 0,
    totalTipsSum: 0,
    totalDeliveries: 0,
  });
  const [riderOrderEarnings, setRiderOrderEarnings] = useState<
    IRiderEarningsArray[]
  >([] as IRiderEarningsArray[]);
  const [userId, setUserId] = useState<string | null>(null);
  const [zoneId, setZoneId] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  // Refs
  const locationListener = useRef<LocationSubscription>();
  const coordinatesRef = useRef<LocationObject>({} as LocationObject);

  // Context
  // const { locationPermission } = useLocationContext()

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfile,
  } = useQuery(RIDER_PROFILE, {
    fetchPolicy: "cache-first",
    skip: !userId || isInitializing,
    variables: {
      id: userId,
    },
  }) as QueryResult<IRiderProfileResponse | undefined, { id: string }>;

  const {
    client,
    loading: loadingAssigned,
    error: errorAssigned,
    data: dataAssigned,
    networkStatus: networkStatusAssigned,
    subscribeToMore,
   refetch: refetchAssigned
  } = useQuery(RIDER_ORDERS, {
    // onCompleted,
    // onError: error2,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    pollInterval: 5000,
    skip: !userId || isInitializing,
  });

  async function getUserId() {
    try {
      // Add timeout for AsyncStorage operation
      const idPromise = AsyncStorage.getItem("rider-id");
      const timeoutPromise = new Promise<string | null>((resolve) =>
        setTimeout(() => resolve(null), 2000)
      );
      
      const id = await Promise.race([idPromise, timeoutPromise]);
      if (id) {
        setUserId(id);
      }
    } catch (error) {
      console.error("Error getting rider-id from AsyncStorage:", error);
    } finally {
      setIsInitializing(false);
    }
  }

  const trackRiderLocation = async () => {
    try {
      // Check if already tracking
      if (locationListener.current) {
        return;
      }

      locationListener.current = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.BestForNavigation,
          timeInterval: 60000,
          distanceInterval: 10,
        },
        async (location) => {
          try {
            const token = await AsyncStorage.getItem(RIDER_TOKEN);
            if (!token) return;
            if (
              coordinatesRef.current?.coords?.latitude ===
                location.coords?.latitude &&
              coordinatesRef.current?.coords?.longitude ===
                location.coords?.longitude
            )
              return;
            coordinatesRef.current = location;
            await client.mutate({
              mutation: UPDATE_LOCATION,
              variables: {
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
              },
            });
          } catch (error) {
            console.error("Error updating location:", error);
          }
        }
      );
    } catch (error) {
      console.error("Error starting location tracking:", error);
    }
  };

  // UseEffects
  useEffect(() => {
    if (!dataProfile?.rider?.zone?._id || !dataProfile?.rider?._id) return;

    let unsubAssignOrder: (() => void) | undefined;
    let unsubZoneOrder: (() => void) | undefined;

    try {
      // Set zone ID
      if (dataProfile?.rider?.zone?._id) {
        setZoneId(dataProfile.rider.zone._id);
      }

      // Subscribe to assigned rider orders
      try {
        unsubAssignOrder = subscribeToMore({
          document: SUBSCRIPTION_ASSIGNED_RIDER,
          variables: { riderId: dataProfile?.rider?._id ?? userId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            if (subscriptionData.data.subscriptionAssignRider.origin === "new") {
              return {
                riderOrders: [
                  subscriptionData.data.subscriptionAssignRider.order,
                  ...prev.riderOrders,
                ],
              };
            } else if (
              subscriptionData.data.subscriptionAssignRider.origin === "remove"
            ) {
              return {
                riderOrders: [
                  ...prev.riderOrders.filter(
                    (o: IOrder) =>
                      o._id !==
                      subscriptionData.data.subscriptionAssignRider.order._id
                  ),
                ],
              };
            }
            return prev;
          },
          onError: (error) => {
            console.error("Error in assigned rider subscription:", error);
          },
        });
      } catch (assignError) {
        console.error("Error setting up assigned rider subscription:", assignError);
      }

      // Subscribe to zone orders
      try {
        unsubZoneOrder = subscribeToMore({
          document: SUBSCRIPTION_ZONE_ORDERS,
          variables: { zoneId: dataProfile?.rider?.zone?._id ?? zoneId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;

            if (subscriptionData.data.subscriptionZoneOrders.origin === "new") {
              return {
                riderOrders: [
                  subscriptionData.data.subscriptionZoneOrders.order,
                  ...prev.riderOrders,
                ],
              };
            }
            return prev;
          },
          onError: (error) => {
            console.error("Error in zone orders subscription:", error);
          },
        });
      } catch (zoneError) {
        console.error("Error setting up zone orders subscription:", zoneError);
      }
    } catch (error) {
      console.error("Error setting up subscriptions:", error);
    }

    return () => {
      try {
        if (unsubZoneOrder) {
          unsubZoneOrder();
        }
      } catch (err) {
        console.error("Error unsubscribing from zone orders:", err);
      }

      try {
        if (unsubAssignOrder) {
          unsubAssignOrder();
        }
      } catch (err) {
        console.error("Error unsubscribing from assigned orders:", err);
      }
    };
  }, [dataProfile, userId, zoneId, subscribeToMore]);

  useEffect(() => {
    if (!userId) return;

    refetchProfile({ id: userId }).catch((error) => {
      console.error("Error refetching profile:", error);
    });
  }, [userId, refetchProfile]);

  useEffect(() => {
    // Set up listener first to catch any immediate updates
    const listener = asyncStorageEmitter.addListener("rider-id", (data) => {
      const newUserId = data?.value ?? null;
      if (newUserId && newUserId !== userId) {
        setUserId(newUserId);
        setIsInitializing(false);
      }
    });

    // Load userId immediately
    getUserId();
    
    // Start location tracking only if userId is available
    if (userId) {
      trackRiderLocation();
    }
    
    return () => {
      if (locationListener.current) {
        locationListener?.current?.remove();
      }

      if (listener) {
        listener.removeListener("rider-id", () => {
          console.log("Rider Id listener removed");
        });
      }
    };
  }, []);

  // Start location tracking when userId becomes available
  useEffect(() => {
    if (userId && !locationListener.current) {
      trackRiderLocation();
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        modalVisible,
        riderOrderEarnings,
        setModalVisible,
        setRiderOrderEarnings,
        userId,
        loadingProfile,
        errorProfile,
        dataProfile: dataProfile?.rider ?? null,
        loadingAssigned,
        errorAssigned,
        assignedOrders:
          loadingAssigned || errorAssigned ? [] : dataAssigned?.riderOrders,
        refetchAssigned,
        refetchProfile,
        networkStatusAssigned,
        requestForegroundPermissionsAsync,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;
export const useUserContext = () => useContext(UserContext);
export default UserContext;

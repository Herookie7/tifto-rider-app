// Core
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useState } from "react";

// Interfaces§
import { RIDER_TOKEN } from "@/lib/utils/constants";
import { IAuthContext, IAuthProviderProps } from "@/lib/utils/interfaces";
import { useRouter } from "expo-router";
import { removeItem } from "@/lib/services/async-storage";

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);

export const AuthProvider: React.FC<IAuthProviderProps> = ({
  client,
  children,
}) => {
  // Hooks
  const router = useRouter();

  // State
  const [token, setToken] = useState<string>("");

  const setTokenAsync = async (token: string) => {
    try {
      await AsyncStorage.setItem(RIDER_TOKEN, token);
      await client.clearStore();
      setToken(token);
    } catch (error) {
      console.error("Error setting token:", error);
      // Still set token in state even if storage fails
      setToken(token);
    }
  };

  const logout = async () => {
    try {
      // Clear storage first to ensure logout happens immediately
      try {
        await removeItem(RIDER_TOKEN);
        await removeItem("rider-id");
      } catch (storageError) {
        console.error("Error clearing storage:", storageError);
      }

      // Stop location updates if they were started
      try {
        const hasLocationUpdates =
          await Location.hasStartedLocationUpdatesAsync("RIDER_LOCATION");
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync("RIDER_LOCATION");
        }
      } catch (locationError) {
        console.error("Error stopping location updates:", locationError);
      }

      // Clear Apollo cache
      try {
        await client.clearStore();
      } catch (apolloError) {
        console.error("Error clearing Apollo store:", apolloError);
      }

      // Reset token state
      setToken("");

      // Navigate to login
      try {
        router.replace("/login");
      } catch (navError) {
        console.error("Error navigating to login:", navError);
      }
    } catch (e) {
      console.error("Logout Error: ", e);
      // Still try to navigate to login even if other operations fail
      try {
        setToken("");
        router.replace("/login");
      } catch (navError) {
        console.error("Critical error during logout:", navError);
      }
    }
  };

  const values: IAuthContext = {
    token: token ?? "",
    logout,
    setTokenAsync,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

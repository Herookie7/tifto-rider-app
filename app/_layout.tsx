/* eslint-disable @typescript-eslint/no-require-imports */
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import FlashMessage from "react-native-flash-message";

// Service
import setupApollo from "@/lib/apollo";
import getEnvVars from "@/environment";

// Providers
import { AuthProvider } from "@/lib/context/global/auth.context";
import { ConfigurationProvider } from "@/lib/context/global/configuration.context";
import { LocationProvider } from "@/lib/context/global/location.context";
import { SoundProvider } from "@/lib/context/global/sound.context";
import { UserProvider } from "@/lib/context/global/user.context";
import { ApolloProvider } from "@apollo/client";

// Locale
import "@/i18next";

// Style
import InternetProvider from "@/lib/context/global/internet-provider";
import AppThemeProvidor from "@/lib/context/global/theme.context";
import RootStackLayout from "@/lib/ui/layouts/root-layout";
import { LocationPermissionComp, ErrorBoundary } from "@/lib/ui/useable-components";
import AnimatedSplashScreen from "@/lib/ui/useable-components/splash/AnimatedSplashScreen";
import UnavailableStatus from "@/lib/ui/useable-components/unavailable-status";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { useEffect, useMemo } from "react";

import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen?.preventAutoHideAsync();


function RootLayout() {
  // Hooks
  const [loaded] = useFonts({
    SpaceMono: require("../lib/assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("../lib/assets/fonts/Inter.ttf"),
  });

  // Get environment variables (using defaults - configuration context values are optional)
  const envVars = useMemo(() => {
    const vars = getEnvVars();
    if (!vars) {
      console.warn("getEnvVars returned undefined. Using hardcoded fallback.");
      return {
        GRAPHQL_URL: "https://ftifto-backend.onrender.com/graphql",
        WS_GRAPHQL_URL: "wss://ftifto-backend.onrender.com/graphql",
        GOOGLE_MAPS_KEY: "",
        ENVIRONMENT: "production",
      };
    }
    return vars;
  }, []);

  // Memoize Apollo client to prevent recreation on every render
  const client = useMemo(() => {
    try {
      if (!envVars) {
        console.error("envVars is still undefined after check!");
        // Should not happen with above fix
        throw new Error("Environment variables are missing");
      }
      return setupApollo(envVars);
    } catch (error) {
      console.error("Failed to setup Apollo client:", error);
      // Return a minimal client or handle error appropriately
      throw error;
    }
  }, [envVars]);

  // Permissions
  async function grantCameraAndGalleryPermissions() {
    await requestMediaLibraryPermissionsAsync();
  }

  // Use Effect
  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync(); // Handled by AnimatedSplashScreen
    }
  }, [loaded]);
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log("Global Error Caught:", { error, isFatal });
  });
  useEffect(() => {
    grantCameraAndGalleryPermissions();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AnimatedSplashScreen>
        <AppThemeProvidor>
          <ApolloProvider client={client}>
            <AuthProvider client={client}>
              <UserProvider>
                <InternetProvider>
                  <ConfigurationProvider>
                    <LocationProvider>
                      <SoundProvider>
                        <LocationPermissionComp>
                          <RootStackLayout />
                          <UnavailableStatus />
                        </LocationPermissionComp>
                        <StatusBar style="inverted" />
                        <FlashMessage position="bottom" />
                      </SoundProvider>
                    </LocationProvider>
                  </ConfigurationProvider>
                </InternetProvider>
              </UserProvider>
            </AuthProvider>
          </ApolloProvider>
        </AppThemeProvidor>
      </AnimatedSplashScreen>
    </ErrorBoundary>
  );
}

export default RootLayout;

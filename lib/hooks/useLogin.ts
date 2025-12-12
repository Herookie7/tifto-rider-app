// React Native Async Storage

// Expo
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Href, router } from "expo-router";

// Contexts
import { AuthContext } from "../context/global/auth.context";

// GraphQL
import {
  DEFAULT_RIDER_CREDS,
  RIDER_LOGIN,
  RIDER_LOGIN_FALLBACK,
} from "../api/graphql/mutation/login";

// Components
import { FlashMessageComponent } from "../ui/useable-components";

// Interfaces
import { IRiderDefaultCredsResponse, IRiderLoginCompleteResponse, IRiderLoginResponse } from "../utils/interfaces/auth.interface";

// Constants
import { ROUTES } from "../utils/constants";

// Hooks
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { setItem } from "../services/async-storage";
import { getNotificationToken } from "../utils/methods/permission";

const useLogin = () => {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const { t } = useTranslation();

  // Context
  const { setTokenAsync } = useContext(AuthContext);

  // API - Try riderLogin first, fallback to regular login if not available
  const [login] = useMutation(RIDER_LOGIN, {
    onCompleted: onLoginCompleted,
    onError,
  });

  const [loginFallback] = useMutation(RIDER_LOGIN_FALLBACK, {
    onCompleted: (data) => {
      // Handle fallback login response (same structure as riderLogin)
      if (data?.login) {
        onLoginCompleted({ riderLogin: data.login });
      }
    },
    onError,
  });

  useQuery(DEFAULT_RIDER_CREDS, { onCompleted: onDefaultCredsCompleted });

  // Handlers
  // For login mutation
  async function onLoginCompleted({ riderLogin }: { riderLogin: IRiderLoginResponse }) {
    if (!riderLogin) {
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("riderLogin", riderLogin);
      
      // Save rider-id first - this will emit the event that user context listens to
      await setItem("rider-id", riderLogin.userId);
      
      // Set token - this clears the Apollo cache
      await setTokenAsync(riderLogin.token);
      
      // Small delay to ensure user context has picked up the userId
      // The asyncStorageEmitter emits synchronously, but we want to ensure
      // the context has processed it before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Navigate to home
      router.replace(ROUTES.home as Href);
    } catch (error) {
      console.error("Error in onLoginCompleted:", error);
      FlashMessageComponent({
        message: t("Failed to complete login. Please try again."),
      });
    } finally {
      setIsLoading(false);
    }
  }

// For default credentials query
function onDefaultCredsCompleted({ lastOrderCreds }: { lastOrderCreds: IRiderDefaultCredsResponse }) {
  if (lastOrderCreds?.riderUsername && lastOrderCreds?.riderPassword) {
    console.log("lastOrderCreds", lastOrderCreds);
    setCreds({
      username: lastOrderCreds.riderUsername,
      password: lastOrderCreds.riderPassword,
    });
  }
}

  function onError(err: ApolloError) {
    const error = err as ApolloError;
    setIsLoading(false);
    FlashMessageComponent({
      message:
        error?.graphQLErrors[0]?.message ??
        error?.networkError?.message ??
        t("Something went wrong"),
    });
  }
  
  const onLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      const notificationToken = await getNotificationToken();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Try riderLogin first
      try {
        await login({
          variables: {
            username: username.toLowerCase(),
            password,
            notificationToken,
            timeZone,
          },
        });
      } catch (err: any) {
        // If riderLogin mutation doesn't exist, use fallback
        if (err?.graphQLErrors?.[0]?.message?.includes('Cannot query field "riderLogin"')) {
          console.log('riderLogin mutation not available, using fallback');
          await loginFallback({
            variables: {
              email: username.toLowerCase(),
              password,
              type: 'rider',
              notificationToken,
            },
          });
        } else {
          throw err;
        }
      }
    } catch (err) {
      const error = err as ApolloError;
      console.log("Login error:", error);
      FlashMessageComponent({ message: error.message || "Login failed. Please try again." });
      setIsLoading(false);
    }
  };

  return {
    creds,
    onLogin,
    isLogging: isLoading,
  };
};
export default useLogin;

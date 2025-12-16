"use client";

// Core
import React, { useCallback, useEffect, useState } from "react";

// Interfaces§
import {
  IConfiguration,
  IConfigurationProviderProps,
  ILazyQueryResult,
} from "@/lib/utils/interfaces";

// API
import { GET_CONFIGURATION } from "@/lib/api/graphql";

// Hooks
import { useLazyQueryQL } from "@/lib/hooks/useLazyQueryQL";

export const ConfigurationContext = React.createContext<
  IConfiguration | undefined
>({
  _id: "",
  googleApiKey: "",
  riderAppSentryUrl: "",
  currency: "INR",
  currencySymbol: "₹",
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  // Default configuration fallback
  const defaultConfiguration: IConfiguration = {
    _id: "",
    googleApiKey: "",
    riderAppSentryUrl: "",
    currency: "INR",
    currencySymbol: "₹",
  };

  const [configuration, setConfiguration] = useState<IConfiguration>(
    defaultConfiguration
  );
  
  // API
  const { fetch, loading, error, data } = useLazyQueryQL(GET_CONFIGURATION, {
    debounceMs: 300,
  }) as ILazyQueryResult<
    { configuration: IConfiguration } | undefined,
    undefined
  >;

  // Handlers
  const onFetchConfiguration = useCallback(() => {
    try {
      if (loading) {
        // Keep current configuration while loading
        return;
      }

      if (error || !data) {
        console.log("Configuration fetch error, using defaults:", error);
        setConfiguration(defaultConfiguration);
        return;
      }

      const fetchedConfig = data?.configuration;
      if (fetchedConfig) {
        setConfiguration(fetchedConfig);
      } else {
        setConfiguration(defaultConfiguration);
      }
    } catch (error) {
      console.error("Configuration error: ", error);
      setConfiguration(defaultConfiguration);
    }
  }, [loading, error, data]);

  const fetchConfiguration = useCallback(() => {
    try {
      fetch();
    } catch (error) {
      console.error("Error fetching configuration:", error);
      setConfiguration(defaultConfiguration);
    }
  }, [fetch]);

  // Use Effect
  useEffect(() => {
    fetchConfiguration();
  }, [fetchConfiguration]);

  useEffect(() => {
    onFetchConfiguration();
  }, [onFetchConfiguration]);

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};

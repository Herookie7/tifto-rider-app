import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import * as Updates from "expo-updates";
import { IConfiguration } from "./lib/utils/interfaces";

// Default environment values
const DEFAULT_ENV_VARS = {
  GRAPHQL_URL: "https://ftifto-backend.onrender.com/graphql",
  WS_GRAPHQL_URL: "wss://ftifto-backend.onrender.com/graphql",
  GOOGLE_MAPS_KEY: "",
  ENVIRONMENT: __DEV__ ? "development" : "production",
};

// Pure function that accepts optional configuration
const getEnvVars = (configuration?: IConfiguration) => {
  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }

  return {
    GRAPHQL_URL: DEFAULT_ENV_VARS.GRAPHQL_URL,
    WS_GRAPHQL_URL: DEFAULT_ENV_VARS.WS_GRAPHQL_URL,
    GOOGLE_MAPS_KEY: configuration?.googleApiKey ?? DEFAULT_ENV_VARS.GOOGLE_MAPS_KEY,
    ENVIRONMENT: DEFAULT_ENV_VARS.ENVIRONMENT,
  };
};

// Hook version for use in React components
export const useEnvVars = () => {
  // This will be used in components that have access to ConfigurationContext
  // For now, return default values - components should use ConfigurationContext directly
  return getEnvVars();
};

export default getEnvVars;

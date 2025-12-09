/**
 * Currency formatting utilities for Tifto Rider App
 * Default currency: INR (₹)
 */

import { useContext } from "react";
import { ConfigurationContext } from "@/lib/context/global/configuration.context";

/**
 * Format currency amount with symbol
 * @param amount - The amount to format
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string (e.g., "₹100" or "100")
 */
export const formatCurrency = (
  amount: number | string | undefined | null,
  showSymbol: boolean = true
): string => {
  if (amount === undefined || amount === null || amount === "") {
    return showSymbol ? "₹0" : "0";
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return showSymbol ? "₹0" : "0";
  }

  // Format with Indian number system (lakhs, crores)
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numAmount);

  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Get currency symbol from configuration
 * @returns Currency symbol (default: ₹)
 */
export const getCurrencySymbol = (): string => {
  // This will be used with ConfigurationContext in components
  return "₹"; // Default for India
};

/**
 * Format currency with configuration context
 * Uses the ConfigurationContext to get the currency symbol
 */
export const useFormatCurrency = () => {
  // Note: This hook should be used in components that have ConfigurationContext
  return (amount: number | string | undefined | null, showSymbol: boolean = true): string => {
    return formatCurrency(amount, showSymbol);
  };
};

/**
 * Format number for display (simplified version for large numbers)
 * @param number - The number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export const formatNumberForDisplay = (number: number): string => {
  if (number < 10000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (number < 10000000) {
    return (number / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  } else {
    return (number / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
  }
};


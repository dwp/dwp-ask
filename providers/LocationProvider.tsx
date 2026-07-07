"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ChatHistoryType, LocationContextType } from "@/types";
import { loadHistory } from "@/utils";

/** Context for sharing the claimant's selected country location. */
const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

/**
 * Provides claimant location state to child components.
 * Initialises location from existing chat history on mount.
 */
export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] =
    useState<LocationContextType["location"]>(null);

  useEffect(() => {
    // Initialise location from chat history if available
    try {
      const chatHistory = loadHistory();

      if (chatHistory && chatHistory.length > 0) {
        const countrySetMessage = chatHistory.find(
          (message: ChatHistoryType) => message.hasSetCountry,
        );

        if (countrySetMessage) {
          setLocation(countrySetMessage.location || null);
        }
      }
    } catch (error: unknown) {
      console.error(error);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Hook to access the current location context.
 *
 * @returns location state and setter
 * @throws Error if used outside of LocationProvider
 */
export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
};

export default LocationProvider;

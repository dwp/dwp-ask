"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadHistory } from "@/app/utils";
import type { ChatHistoryType } from "../types";

type LocationContextType = {
  location: string | null;
  setLocation: (location: string) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<string | null>(null);

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
    } catch (error) {
      console.error("LocationProvider - error initializing location:", error);
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

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
};

export default LocationProvider;

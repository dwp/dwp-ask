"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getLocation } from "@/app/utils";

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
    const loc = getLocation();
    if (loc) setLocation(loc);
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

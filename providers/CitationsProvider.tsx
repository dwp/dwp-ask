"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import type { ChatHistoryType, CitationsContextType } from "@/types";

/** Context for sharing citation state across chat components. */
const CitationsContext = createContext<CitationsContextType | undefined>(
  undefined,
);

/** Provides citation state (source documents) to child components. */
export const CitationsProvider = ({ children }: { children: ReactNode }) => {
  const [citations, setCitations] =
    useState<ChatHistoryType["citations"]>(undefined);

  return (
    <CitationsContext.Provider
      value={{
        citations,
        setCitations,
      }}
    >
      {children}
    </CitationsContext.Provider>
  );
};

/**
 * Hook to access the current citations context.
 *
 * @returns citations state and setter
 * @throws Error if used outside of CitationsProvider
 */
export const useCitations = () => {
  const ctx = useContext(CitationsContext);
  if (!ctx) {
    throw new Error("useCitations must be used within a CitationsProvider");
  }
  return ctx;
};

export default CitationsProvider;

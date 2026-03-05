"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ChatHistoryType } from "../types";

type CitationsContextType = {
  citations: ChatHistoryType["citations"];
  setCitations: (citations: ChatHistoryType["citations"]) => void;
};

const CitationsContext = createContext<CitationsContextType | undefined>(
  undefined,
);

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

export const useCitations = () => {
  const ctx = useContext(CitationsContext);
  if (!ctx) {
    throw new Error("useCitations must be used within a CitationsProvider");
  }
  return ctx;
};

export default CitationsProvider;
